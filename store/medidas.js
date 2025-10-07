export const state = () => ({
    findrisc: {
        imc: null,
        perimetro_abdominal: null,
    },
    examenF: {
        peso: null,
        talla: null,
        imc: null,
        perimetro_abdominal: null,
        sistolica: null,
        presion_diastolica: null,
        presion_sistolica: null,
        poseePieDiabetico: null,
    },

    framingham: {
        presion_diastolica: null,
        presion_sistolica: null,
    },

    medidasAntropometricas: {
        peso: null
    },

    estiloVida: {
        expuesto_humo: null
    },

    creatinina: {
        resultado_lab: null,
        emitGuardarFr: null

    }
});

export const mutations = {
    SET_EXAMENF(state, payload) {
        state.examenF = {
            ...state.examenF,
            ...payload
        };

        if (payload.perimetro_abdominal) {
            state.findrisc.perimetro_abdominal = payload.perimetro_abdominal;
        }
        if (payload.imc) {
            state.findrisc.imc = payload.imc;
        }
        if (payload.presion_diastolica) {
            state.framingham.presion_diastolica = payload.presion_diastolica;
        }
        if (payload.presion_sistolica) {
            state.framingham.presion_sistolica = payload.presion_sistolica;
        }
        if (payload.peso) {
            state.medidasAntropometricas.peso = payload.peso;
        }
    },

    SET_ESTILOVIDA(state, payload) {
        state.estiloVida = payload
    },

    SET_CREATININA(state, payload) {
        state.creatinina = payload
    }

};

export const actions = {
    updateExamenF({
        commit
    }, payload) {
        commit('SET_EXAMENF', payload);
    },

    setEstiloVida({
        commit
    }, payload) {
        commit('SET_ESTILOVIDA', payload);
    },

    setCreatinina({
        commit
    }, payload) {
        commit('SET_CREATININA', payload);
    },

};

export const getters = {
    findrisc: (state) => state.findrisc,
    examenF: (state) => state.examenF,
    framingham: (state) => state.framingham,
    medidasAntropometricas: (state) => state.medidasAntropometricas,
    estiloVida: (state) => state.estiloVida,
    creatinina: (state) => state.creatinina

};
