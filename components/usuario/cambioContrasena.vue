<template>
    <div>
        <v-card>
            <v-card-text>
                <v-card-title v-if="ocultarBotones">
                    <v-toolbar flat>
                        <v-toolbar-title>
                            <div class="d-flex align-center">
                                <img src="/images/ojo.svg" alt="" height="50px" width="50px" />
                                <span>Cambiar Contraseña</span>
                            </div>
                        </v-toolbar-title>
                        <v-divider class="mx-4" inset vertical></v-divider>
                    </v-toolbar>
                </v-card-title>
                <v-alert dense text color="warning" border="left" icon="mdi-information-variant">
                    Por seguridad de su cuenta y la protección de los datos es necesario que
                    cambie su
                    contraseña por una mas Segura
                </v-alert>

                <v-form ref="valCambioContrasena">
                    <v-row dense>

                        <v-col cols="12" sm="12" md="12">
                            <v-text-field :disabled="deshabilitarFormulario" v-if="requerirContrasena"
                                v-model="formContrasena.contrasenaActual" :type="mostrarNueva ? 'text' : 'password'"
                                :append-icon="mostrarNueva ? 'mdi-eye-off' : 'mdi-eye'"
                                @click:append="mostrarNueva = !mostrarNueva" :rules="[rules.obligatorio]"
                                label="Contraseña Actual*" dense outlined>

                            </v-text-field>
                        </v-col>

                        <v-col cols="12" sm="12" md="12">
                            <v-text-field v-model="formContrasena.nuevaContrasena" :disabled="deshabilitarFormulario"
                                :type="mostrarNueva ? 'text' : 'password'"
                                :append-icon="mostrarNueva ? 'mdi-eye-off' : 'mdi-eye'"
                                @click:append="mostrarNueva = !mostrarNueva"
                                :rules="[rules.obligatorio, rules.passwordSegura]" label="Nueva contraseña *" dense
                                outlined />
                        </v-col>

                        <v-col cols="12" sm="12" md="12">
                            <v-text-field v-model="formContrasena.confirmarContrasena"
                                :disabled="deshabilitarFormulario" :type="mostrarConfirmar ? 'text' : 'password'"
                                :append-icon="mostrarConfirmar ? 'mdi-eye-off' : 'mdi-eye'"
                                @click:append="mostrarConfirmar = !mostrarConfirmar" @paste.prevent
                                :rules="[rules.obligatorio, rules.contrasenasCoinciden]"
                                label="Confirmar nueva contraseña *" dense outlined />
                        </v-col>
                    </v-row>
                </v-form>


                <v-card-actions v-if="ocultarBotones">
                    <v-spacer></v-spacer>
                    <v-btn color="error" @click="cerrarModal()" :disabled="deshabilitarFormulario">cerrar
                        <v-icon right>mdi-close</v-icon></v-btn>
                    <v-btn color="success" @click="cambiarContrasena()" :disabled="deshabilitarFormulario">cambiar
                        contraseña
                        <v-icon right>mdi-lock-check-outline</v-icon></v-btn>
                </v-card-actions>

            </v-card-text>

        </v-card>


        <v-dialog v-model="preload" persistent width="300">
            <v-card color="primary" dark>
                <v-card-text>
                    Tranquilo procesamos tu solicitud !
                    <v-progress-linear indeterminate color="white" class="mb-0"></v-progress-linear>
                </v-card-text>
            </v-card>
        </v-dialog>
    </div>
</template>
<script>

export default {

    props: {

        usuario_id: {
            type: Number
        },

        requerirContrasena: {
            type: Boolean,
            default: false
        },

        ocultarBotones: {
            type: Boolean,
        },

    },

    data() {
        return {
            preload: false,
            mostrarConfirmar: false,
            mostrarNueva: false,
            formContrasena: {
                nuevaContrasena: null,
                confirmarContrasena: null,
                contrasenaActual: null
            },
            rules: {
                obligatorio: (v) => !!v || "Este campo es obligatorio.",
                passwordSegura: v =>
                    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/.test(v) ||
                    'La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial',
                contrasenasCoinciden: v =>
                    v === this.formContrasena.nuevaContrasena ||
                    'Las contraseñas no coinciden'
            },
            deshabilitarFormulario: false,
            intentos: 0
        }
    },

    methods: {
        async cambiarContrasena({ propagateError = false } = {}) {
            try {
                this.intentos++;

                if (!this.$refs.valCambioContrasena.validate()) return;

                if (this.requerirContrasena && this.intentos === 5) {
                    return this.inactivarTemporalmente();
                }

                this.preload = true;

                const data = {
                    password: this.formContrasena.nuevaContrasena,
                    password_changed_at: new Date(),
                    password_current: this.formContrasena.contrasenaActual,
                };

                await this.$axios.post(
                    `/actualizacion/actualizar-contrasena-usuario/${this.usuario_id}`,
                    data
                );

                this.$toast.success("Contraseña cambiada correctamente");
                this.cerrarModal();
                this.$refs.valCambioContrasena.resetValidation();
                this.limpiarFormulario();

            } catch (error) {
                if (error.response?.data?.error) {
                    this.$swal({
                        type: "error",
                        title: "Error",
                        text: error.response.data.error,
                    });
                } else {
                    this.$toast.error("Error al actualizar la contraseña. Por favor, inténtelo de nuevo más tarde.");
                }

                if (propagateError) throw error;
            } finally {
                this.preload = false;
            }
        },

        cerrarModal() {
            this.limpiarFormulario();
            this.$emit("quitarBloqueo");
            this.$emit('cerrarModal');
        },

        limpiarFormulario() {
            this.formContrasena = {
                nuevaContrasena: null,
                confirmarContrasena: null
            }
        },

        async inactivarTemporalmente() {

            try {
                this.preload = true;
                const data = {
                    email: this.$store.state.auth.usuario.email,
                }
                await this.$axios.post('/auth/inactivar-usuario-temporal', data)

                this.$swal({
                    title: "Atención",
                    text: `¡Demasiados intentos fallidos! Su usuario ha sido bloqueado temporalmente por 30 minutos.`,
                    type: "error",
                    showCancelButton: true,
                    showConfirmButton: false,
                    cancelButtonText: "Cerrar",
                    cancelButtonColor: "#d33",
                });
                this.cerrarCesiones();
                this.deshabilitarFormulario = true
            } catch (error) {
                this.$toast.error(error.response.data.error || 'Ha ocurrido un error');
            } finally {
                this.preload = false;
            }

        },
        cerrarCesiones() {
            this.$axios.post(`/auth/cerrar-sesion`, {
                user_id: this.$store.state.auth.usuario.id,
            })
        },

    }
}
</script>