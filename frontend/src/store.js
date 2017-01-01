import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

import { API } from 'src/utils'

export const store = new Vuex.Store({
  state: {
    firstrun: false,
    user: {
      username: localStorage['username'] || "",
      token: localStorage['token'] || ""
    },
    students: [],
    subjects: [],
    exams: [],
    scores: [],
    loading: {
      students: true,
      subjects: true,
      exams: true,
      scores: true
    }
  },
  mutations: {
    updateStudents(state, students) {
      state.students = students
      state.loading.students = false
    },
    updateSubjects(state, subjects) {
      state.subjects = subjects
      state.loading.subjects = false
    },
    updateExams(state, exams) {
      state.exams = exams
      state.loading.exams = false
    },
    updateScores(state, scores) {
      state.scores = scores
      state.loading.scores = false
    },
    login(state, user) {
      state.firstrun = false
      localStorage['username'] = user.username
      localStorage['token'] = user.token
      state.user = user
    }
  },
  getters: {
    username: state => state.user.username,
    students: state => state.students,
    classes: state => state.classes,
    subjects: state => state.subjects,
    exams: state => state.exams,
    scores: state => state.scores,
    loading: state =>  false && Object.values(state.loading).some(v => v === true),
    studentNames: (state, getters) => {
      const studentMap = {}
      for(let student of getters.students) {
        studentMap[student.id] = student.name
      }
      return studentMap
    },
    examNames: (state, getters) => {
      const examMap = {}
      for(let exam of getters.exams) {
        examMap[exam.id] = exam.name
      }
      return examMap
    },
    subjectNames: (state, getters) => {
      const subjectMap = {}
      for(let s of getters.subjects) {
        subjectMap[s.id] = s.name
      }
      return subjectMap
    }
  },
  actions: {
    fetchStudents(context) {
      API.get('/student').then(res => {
        context.commit('updateStudents', res.data)
      }).catch(err => console.error(err))
    },
    fetchSubjects(context) {
      API.get('/subject').then(res => {
        context.commit('updateSubjects', res.data)
      }).catch(err => console.error(err))
    },
    fetchExams(context) {
      API.get('/exam').then(res => {
        context.commit('updateExams', res.data)
      }).catch(err => console.error(err))
    },
    fetchScores(context) {
      API.get('/score').then(res => {
        context.commit('updateScores', res.data)
      }).catch(err => console.error(err))
    },
    async login({ commit, dispatch }, user) {
      await commit('login', user)
      initFetch()
    }
  }
})

function initFetch() {
  const dispatch = store.dispatch
  dispatch('fetchSubjects')
  dispatch('fetchScores')
  dispatch('fetchStudents')
  dispatch('fetchExams')
}

if (store.state.user.token) {
  initFetch()
}
