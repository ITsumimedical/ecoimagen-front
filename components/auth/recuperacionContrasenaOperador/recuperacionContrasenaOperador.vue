<template>
    <div>

        <div class="text-center">
            <v-dialog v-model="preload" persistent width="300">
                <v-card color="primary" dark>
                    <v-card-text>
                        Tranquilo procesamos tu solicitud !
                        <v-progress-linear indeterminate color="white" class="mb-0"></v-progress-linear>
                    </v-card-text>
                </v-card>
            </v-dialog>
        </div>

        <v-alert dense text color="primary" icon="mdi-account-search" border="left" class="text-center">
            <b>Recuperar Contraseña - Funcionario</b>
        </v-alert>

        <v-stepper v-model="e1">
            <v-stepper-header>

                <v-stepper-step :complete="e1 > 1" step="1">
                    Buscar Funcionario
                </v-stepper-step>

                <v-divider></v-divider>

                <v-stepper-step :complete="e1 > 2" step="2">
                    Recuperacion de Contraseña
                </v-stepper-step>

                <v-divider></v-divider>

                <v-stepper-step :complete="e1 > 3" step="3">
                    Cambiar contraseña
                </v-stepper-step>

            </v-stepper-header>


            <v-stepper-items>

                <v-stepper-content step="1">

                    <v-card class="pa-6">
                        <v-alert text dense border="left" type="info" icon="mdi-shield-key-outline">
                            Validación de información
                        </v-alert>

                        <v-form ref="valForm">
                            <v-row>
                                <v-col cols="12" sm="12" md="12">
                                    <v-text-field label="Correo electronico" dense outlined
                                        v-model="formRecuperar.email"
                                        hint="Ingrese el correo electrónico de Recuperacion Ingresado en la plataforma"
                                        :rules="[rules.obligatorio]">
                                    </v-text-field>
                                </v-col>

                                <v-col cols="12" sm="12" md="12">
                                    <v-text-field label="Numero de Documento" dense outlined
                                        :rules="[rules.obligatorio]"
                                        hint="Ingrese su número de identificación sin puntos"
                                        v-model="formRecuperar.documento" />
                                </v-col>

                            </v-row>
                        </v-form>
                    </v-card>

                </v-stepper-content>

                <v-stepper-content step="2">
                    <v-card class="pa-6">
                        <v-alert text dense border="left" type="info" icon="mdi-shield-key-outline">
                            Por favor ingresa el Codigo de 6 Digitos enviado a tu Correo , Revisa en tu bandeja de
                            entrada , Spam o
                            Correos no deseados
                        </v-alert>

                        <v-row align="center" justify="center">
                            <v-col cols="6" sm="6" md="6">
                                <v-text-field dense outlined label="Ingrese el codigo de 6 Digitos enviado"
                                    v-model="codigoIngresado" :rules="[rules.obligatorio, rules.max]"></v-text-field>
                            </v-col>
                        </v-row>
                    </v-card>

                </v-stepper-content>

            </v-stepper-items>

            <v-stepper-content step="3">


                <cambio-contrasena ref="cambioContrasena" :usuario_id="this.registroId" :ocultarBotones="false"
                    v-if="this.registroId" :requerir-contrasena="false" />

            </v-stepper-content>

            <v-row justify="end" class="px-6 pb-6">
                <v-btn @click="cerrarModal()" class="mr-2" color="error">salir<v-icon right>mdi-close</v-icon></v-btn>
                <v-btn color="primary" @click="continuarProceso()" class="mr-2">
                    Continuar <v-icon right>mdi-arrow-right-bold-circle</v-icon>
                </v-btn>
            </v-row>

        </v-stepper>
    </div>
</template>
<script>
import CambioContrasena from '~/components/usuario/cambioContrasena.vue';
export default {

    components: {
        CambioContrasena
    },

    data() {
        return {
            e1: 1,
            formRecuperar: {
                documento: null,
                email: null,
            },
            rules: {
                obligatorio: (v) => !!v || 'Este campo es Obligatorio'
            },
            codigoIngresado: null,
            registroId: null,
            preload: false
        }
    },

    methods: {

        async continuarProceso() {

            switch (this.e1) {
                case 1: {
                    try {
                        await this.validarInformacion();
                        this.e1 = 2
                    } catch (error) {
                        return;
                    }

                    break;
                }
                case 2: {
                    try {
                        await this.validarCodigo();
                        this.e1 = 3
                    } catch (error) {
                        return;
                    }

                    break;
                }

                case 3: {
                    try {
                        await this.$refs.cambioContrasena.cambiarContrasena({ propagateError: true });
                        this.$swal({
                            title: "Atencion",
                            text: "Señor usuario, su contraseña ha sido actualizada correctamente, por favor inicie sesión con su nueva contraseña.",
                            type: "success",
                            showCancelButton: true,
                            showConfirmButton: false,
                            allowOutsideClick: false,
                            cancelButtonColor: "#d33",
                            cancelButtonText: "Cerrar",
                            onClose: () => {
                                this.cerrarModal();
                            }
                        })
                    } catch (error) {
                        return;
                    }
                    break;
                }
            }

        },

        async validarInformacion() {
            if (!this.$refs.valForm.validate()) {
                this.$toast.error('Por favor complete el Formulario');
                throw error;
            }

            try {
                this.preload = true
                const res = await this.$axios.post("/actualizacion/generar-recuperacion-funcionario", this.formRecuperar)
                this.$swal({
                    title: "¡Solicitud realizada !",
                    text: "Revisa tu correo electrónico ",
                    footer: "Si tu correo electrónico no es correcto, comunícate al WhatsApp de soporte técnico ",
                    type: "success",
                });
                this.registroId = res.data;

            } catch (error) {
                if (error.response.status === 422) {
                    this.$swal({
                        title: "¡ Informacion incorrecta !",
                        text: "Por favor revisa tu informacion ingresada",
                        type: "error",
                    })
                } else {
                    this.$toast.error('Ha ocurrido un error al validar la informacion del Usuario');
                }

                throw error;
            } finally {
                this.preload = false
            }
        },

        cerrarModal() {
            this.e1 = 1
            this.formRecuperar = {
                documento: null,
                email: null,
            }
            this.$emit('cerrarModal')
        },

        async validarCodigo() {
            try {
                this.preload = true;
                const data = {
                    codigo_ingresado: this.codigoIngresado,
                    ...this.formRecuperar
                }
                await this.$axios.post('auth/validar-codigo-operador', data);
                this.$toast.success('Codigo validado correctamente');

            } catch (error) {
                this.$toast.error('Ha ocurrido un error al validar el codigo ingresado')
            } finally {
                this.preload = false
            }
        }

    }
}
</script>
