<template>
    <v-dialog :value="value" persistent max-width="600px" @input="$emit('input', $event)">
        <v-card>
            <v-card-title>
                <v-toolbar flat>
                    <v-toolbar-title>
                        <div class="d-flex align-center">
                            <img src="/images/ojo.svg" alt="" height="50" width="50" />
                            <span>Cambiar Contraseña</span>
                        </div>
                    </v-toolbar-title>
                    <v-divider class="mx-4" inset vertical />
                </v-toolbar>
            </v-card-title>

            <v-card-text>
                <v-row dense>
                    <v-col cols="12">
                        <v-alert dense text color="warning" border="left" icon="mdi-information-variant">
                            Por seguridad de su cuenta y la protección de sus datos, es necesario que cambie su
                            contraseña.
                        </v-alert>
                    </v-col>
                </v-row>

                <v-form ref="formCambioContrasena">
                    <v-row dense>
                        <v-col cols="12">
                            <v-text-field v-model="formContrasena.nuevaContrasena"
                                :type="mostrarNueva ? 'text' : 'password'"
                                :append-icon="mostrarNueva ? 'mdi-eye-off' : 'mdi-eye'"
                                @click:append="mostrarNueva = !mostrarNueva"
                                :rules="[...obligatorioRules, ...passwordRules]" label="Contraseña *" dense outlined
                                autocomplete="new-password" />
                        </v-col>

                        <v-col cols="12">
                            <v-text-field v-model="formContrasena.confirmarContrasena"
                                :type="mostrarConfirmar ? 'text' : 'password'"
                                :append-icon="mostrarConfirmar ? 'mdi-eye-off' : 'mdi-eye'"
                                @click:append="mostrarConfirmar = !mostrarConfirmar"
                                :rules="[...obligatorioRules, validarCoincidencia]" label="Confirmar Contraseña *" dense
                                outlined autocomplete="new-password" />
                        </v-col>
                    </v-row>
                </v-form>
            </v-card-text>
            <v-card-actions>
                <v-spacer />
                <v-btn v-if="!obligatorio" small color="error" @click="$emit('input', false)">
                    Cancelar
                </v-btn>
                <v-btn small color="success" @click="cambiarContrasena">
                    Guardar
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
import { mapActions } from 'vuex';

export default {
    props: {
        value: { type: Boolean, default: null },
        usuario: { type: Object, default: null },
        // obligatorio: { type: Boolean, default: true }
    },
    data() {
        return {
            formContrasena: {
                nuevaContrasena: '',
                confirmarContrasena: ''
            },
            mostrarNueva: false,
            mostrarConfirmar: false,
            obligatorioRules: [
                v => !!v || 'Este campo es obligatorio'
            ],
            passwordRules: [
                v => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/.test(v) ||
                    'Debe tener 8+ caracteres, mayúscula, minúscula, número y carácter especial'
            ]
        };
    },
    computed: {
        validarCoincidencia() {
            return v =>
                v === this.formContrasena.nuevaContrasena || 'Las contraseñas no coinciden';
        },
        usuarioLogueado() {
            return this.$store.state.cambioContrasena.usuarioObjetivo || this.$store.state.auth.usuario
        },
        obligatorio() {
            return this.$store.state.cambioContrasena.obligatorio;
        }
    },
    methods: {
        ...mapActions('app', ['setPreload']),
        async cambiarContrasena() {
            if (!this.$refs.formCambioContrasena.validate()) return;

            const payload = {
                password: this.formContrasena.nuevaContrasena,
                password_changed_at: new Date().toISOString()
            };

            try {
                await this.$axios.post(
                    `/usuarios/actualizar-contrasena-usuario/${this.usuarioLogueado?.id}`,
                    payload
                );

                this.$swal({
                    type: 'success',
                    title: 'Contraseña actualizada',
                    text: 'La contraseña se actualizó correctamente.'
                });

                this.$refs.formCambioContrasena.reset();
                this.$emit('input', false);
            } catch (error) {
                const mensaje = error?.response?.data?.mensaje || 'Error al actualizar la contraseña.';

                this.$swal({
                    type: 'error',
                    title: 'No se pudo actualizar',
                    text: mensaje
                });
            }
        }

    }
};
</script>
