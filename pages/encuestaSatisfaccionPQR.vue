<template>
    <v-container class="d-flex justify-center" fluid>
        <v-card>
            <v-card-title>
                <v-toolbar flat class="d-flex flex-wrap align-center">
                    <v-toolbar-title class="d-flex align-center">
                        <img src="/images/ojo.svg" alt="Gestión Sucesos Clínicos" height="50px" width="50px" />
                        <span class="ml-2 font-weight-bold">Encuesta de satisfacción</span>
                    </v-toolbar-title>
                </v-toolbar>
            </v-card-title>
            <v-card-text v-if="formularioEnviado" class="pa-4">
                <v-alert type="success" border="left" elevation="2">
                    ¡Gracias por completar la encuesta! 🎉<br />
                    Tus respuestas han sido registradas.
                </v-alert>
            </v-card-text>
            <v-form v-else ref="form" class="pa-4" @submit.prevent="enviar()">
                <v-col cols="12" class="ml-4 mr-4">
                    <p><b>1. ¿La respuesta que recibió de su Petición, Queja, Reclamo o felicitación le brindó una
                            solución final?</b></p>
                    <v-radio-group row v-model="opcionPregunta1" :rules="[v => !!v || 'Este campo es obligatorio']">
                        <v-radio label="No, en nada" value="no, en nada"></v-radio>
                        <v-radio label="Casi en nada" value="casi en nada"></v-radio>
                        <v-radio label="Parcialmente" value="parcialmente"></v-radio>
                        <v-radio label="En la mayoria" value="en la mayoria"></v-radio>
                        <v-radio label="Si, totalmente" value="si, totalmente"></v-radio>
                    </v-radio-group>
                </v-col>
                <v-col cols="12" class="ml-4 mr-4">
                    <p><b>2. ¿La información en la respuesta fue fácil de compender y clara?</b></p>
                    <v-radio-group row v-model="opcionPregunta2" :rules="[v => !!v || 'Este campo es obligatorio']">
                        <v-radio label="No, en nada" value="no, en nada"></v-radio>
                        <v-radio label="Casi en nada" value="casi en nada"></v-radio>
                        <v-radio label="Parcialmente" value="parcialmente"></v-radio>
                        <v-radio label="En la mayoria" value="en la mayoria"></v-radio>
                        <v-radio label="Si, totalmente" value="si, totalmente"></v-radio>
                    </v-radio-group>
                </v-col>
                <v-col cols="12" class="ml-4 mr-4">
                    <p><b>3. ¿La respuesta fue coherente con su solicitud inicial?</b></p>
                    <v-radio-group row v-model="opcionPregunta3" :rules="[v => !!v || 'Este campo es obligatorio']">
                        <v-radio label="No, en nada" value="no, en nada"></v-radio>
                        <v-radio label="Casi en nada" value="casi en nada"></v-radio>
                        <v-radio label="Parcialmente" value="parcialmente"></v-radio>
                        <v-radio label="En la mayoria" value="en la mayoria"></v-radio>
                        <v-radio label="Si, totalmente" value="si, totalmente"></v-radio>
                    </v-radio-group>
                </v-col>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="green" dark medium @click="enviar()">Enviar</v-btn>
                </v-card-actions>

            </v-form>
        </v-card>

    </v-container>

</template>

<script>
import { mapActions } from "vuex";

export default {
    name: 'EncuestaSatisfaccionPQR',
    auth: false,
    layout: 'actualizacion',
    data() {
        return {
            opcionPregunta1: null,
            opcionPregunta2:null,
            opcionPregunta3:null,
            formularioEnviado:false,
            radicado: null
        };
    },
    created() {
        this.radicado = parseInt(this.$route.query.radicado)
    },
    methods:{
        ...mapActions('app',['setPreload']),

        enviar(){
            if(!this.$refs.form.validate()){return this.$swal({
                type: 'error',
                title: 'Error',
                text: 'Por favor, complete todas las preguntas antes de enviar la respuesta.'
            })}

            const data = {
                radicado: this.radicado,
                pregunta1: this.opcionPregunta1,
                pregunta2: this.opcionPregunta2,
                pregunta3: this.opcionPregunta3
            }
            this.setPreload(true);
            this.$axios.post('/auth/encuesta-satisfaccion?token=KMkm5PyrELKB2jnLMKyBgi8WgPwSNizSwwxJXBuY',data)
            .then(res=>{
                this.formularioEnviado = true;
            })
            .catch(err=>{
                console.log(err)
                this.$swal({
                    type: 'error',
                    title: 'Error',
                    text: `${err.response.data.error}`
                })
                
            })
            .finally(()=>{
                this.setPreload(false);
            })

        }
    }
}

</script>