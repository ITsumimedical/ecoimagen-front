<template>
    <div>
        <v-alert text dense color="info" border="left" class="text-center" icon="mdi-account-convert"><b>CONDUCTAS Y
                RELACIONAMIENTO</b></v-alert>
        <v-col cols="12" sm="12" md="12">
            <v-alert text dense color="warning" border="left" class="text-center"
                icon="mdi-account-circle-outline"><b>FORMACIÓN DE HÁBITOS</b></v-alert>
        </v-col>
        <v-container>
            <v-form ref="form" v-model="valid" lazy-validation>
                <v-row>
                    <v-col cols="12" sm="6" md="6">
                        <v-textarea label="Alimentación" dense outlined auto-grow v-model="formConducta.alimentacion"
                            :rules="camposRequeridos"></v-textarea>
                    </v-col>
                    <v-col cols="12" sm="6" md="6">
                        <v-textarea label="Higiene" dense outlined auto-grow v-model="formConducta.higiene"
                            :rules="camposRequeridos"></v-textarea>
                    </v-col>
                    <v-col cols="12" sm="6" md="6">
                        <v-textarea label="Sueño" dense outlined auto-grow v-model="formConducta.sueno"
                            :rules="camposRequeridos"></v-textarea>
                    </v-col>
                    <v-col cols="12" sm="6" md="6">
                        <v-textarea label="Independencia personal" dense outlined auto-grow
                            v-model="formConducta.independencia_personal" :rules="camposRequeridos"></v-textarea>
                    </v-col>
                    <v-col cols="12" sm="12" md="12">
                        <v-alert text dense color="warning" border="left" class="text-center"
                            icon="mdi-account-details"><b>COMPORTAMIENTO</b></v-alert>
                    </v-col>
                    <v-col cols="12" sm="6" md="6">
                        <v-textarea label="Actividad" dense outlined auto-grow v-model="formConducta.actividad"
                            :rules="camposRequeridos"></v-textarea>
                    </v-col>
                    <v-col cols="12" sm="6" md="6">
                        <v-textarea label="Atención" dense outlined auto-grow v-model="formConducta.atencion"
                            :rules="camposRequeridos"></v-textarea>
                    </v-col>
                    <v-col cols="12" sm="6" md="6">
                        <v-textarea label="Impulsividad" dense outlined auto-grow v-model="formConducta.impulsividad"
                            :rules="camposRequeridos"></v-textarea>
                    </v-col>
                    <v-col cols="12" sm="6" md="6">
                        <v-textarea label="Crisis coléricas" dense outlined auto-grow
                            v-model="formConducta.crisis_colericas" :rules="camposRequeridos"></v-textarea>
                    </v-col>
                    <v-col cols="12" sm="6" md="6">
                        <v-textarea label="Adaptación" dense outlined auto-grow v-model="formConducta.adaptacion"
                            :rules="camposRequeridos"></v-textarea>
                    </v-col>
                    <v-col cols="12" sm="6" md="6">
                        <v-textarea label="Labilidad emocional" dense outlined auto-grow
                            v-model="formConducta.labilidad_emocional" :rules="camposRequeridos"></v-textarea>
                    </v-col>
                    <v-col cols="12" sm="6" md="6">
                        <v-textarea label="Relaciones familiares" dense outlined auto-grow
                            v-model="formConducta.relaciones_familiares" :rules="camposRequeridos"></v-textarea>
                    </v-col>
                    <v-col cols="12" sm="6" md="6">
                        <v-textarea label="Tiempo libre" dense outlined auto-grow v-model="formConducta.tiempo_libre"
                            :rules="camposRequeridos"></v-textarea>
                    </v-col>
                    <v-col cols="12" sm="6" md="6">
                        <v-textarea label="Ruidos muy altos lo molestan" dense outlined auto-grow
                            v-model="formConducta.ruidos_altos" :rules="camposRequeridos"></v-textarea>
                    </v-col>
                    <v-col cols="12" sm="6" md="6">
                        <v-textarea label="Socialización" dense outlined auto-grow v-model="formConducta.socializacion"
                            :rules="camposRequeridos"></v-textarea>
                    </v-col>
                </v-row>
            </v-form>
        </v-container>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
export default {
    props: ['datos'],
    data() {
        return {
            formConducta: {
                alimentacion: '',
                higiene: '',
                sueno: '',
                independencia_personal: '',
                actividad: '',
                atencion: '',
                impulsividad: '',
                crisis_colericas: '',
                adaptacion: '',
                labilidad_emocional: '',
                relaciones_familiares: '',
                tiempo_libre: '',
                ruidos_altos: '',
                socializacion: '',
                consulta_id: this.datos.id
            },
            valid: true,
            camposRequeridos: [
                v => !!v || 'Campo requerido',
            ],
            loading: false,
        }
    },
    mounted() {
        const datosRelacionamiento = this.obtenerDatosPorConsulta(this.datos.id, 'ConductasRelacionamiento/Model/ConductaRelacionamiento', 'historia/formularios/ConductasRelacionamiento');

        if (datosRelacionamiento) {
            this.formConducta = { ...datosRelacionamiento }
        }
    },
    computed: {
        ...mapGetters('historiaClinica', ['obtenerDatosPorConsulta']),
    },

    methods: {

        obtenerDatos() {
                return {
                    datos: this.formConducta
                };
            },
    }
}
</script>
