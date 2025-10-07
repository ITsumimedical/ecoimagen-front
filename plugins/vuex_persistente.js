import createPersistedState from 'vuex-persistedstate'

export default ({ store }) => {
  createPersistedState({
    key: 'historia_clinica',
    paths: ['historiaClinica'],
    storage: window.localStorage
  })(store)
}
