<template>
    <v-dialog v-model="mostrarEditarInfo" persistent max-width="1000px">
        <v-card>
            <v-alert text dense border="left" type="info" icon="mdi-account-edit">
                <b>Editar Información</b>
            </v-alert>
            <v-card-text>
                <v-form ref="formEditarInformacion" @submit.prevent="editarInformacion">
                    <v-row>

                        <v-col cols="12" sm="6" md="6" v-if="tipoUsuarioId !== 2">
                            <v-text-field outlined dense label="Nombres" v-model="formEditarInfo.nombre"
                                prepend-icon="mdi-account"></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6" md="6" v-if="tipoUsuarioId !== 2">
                            <v-text-field outlined dense label="Apellidos"
                                v-model="formEditarInfo.apellido"></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="12" md="12">
                            <v-text-field outlined dense label="Correo Recuperación"
                                v-model="formEditarInfo.email_recuperacion" prepend-icon="mdi-email" :rules="[
                                    () =>
                                        emailRegex.test(formEditarInfo.email_recuperacion) ||
                                        'Debe ser un correo electrónico válido',
                                ]"></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="12" md="12">
                            <v-text-field outlined dense label="Teléfono Recuperación"
                                v-model="formEditarInfo.telefono_recuperacion" prepend-icon="mdi-phone"></v-text-field>
                        </v-col>

                        <!-- <v-col cols="12" sm="6" md="6">
                            <v-text-field dense label="Contraseña" v-model="formEditarInfo.password"
                                :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                                :type="showPassword ? 'text' : 'password'" @click:append="showPassword = !showPassword"
                                :rules="[
                                    (password) =>
                                        passwordRegex.test(password) ||
                                        'La contraseña debe tener al menos 8 caracteres, incluyendo una letra minúscula, una mayúscula, un número y un carácter especial.',
                                ]"></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6" md="6">
                            <v-text-field dense label="Repetir Contraseña" v-model="formEditarInfo.repetir_password"
                                :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                                :type="showPassword ? 'text' : 'password'"
                                @click:append="showPassword = !showPassword"></v-text-field>
                        </v-col> -->

                    </v-row>
                </v-form>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="error" small @click="cerrarModal">Cancelar</v-btn>
                <v-btn color="success" small @click="editarInformacion">Guardar</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
export default {
    props: {
        mostrarEditarInfo: Boolean,
        usuarioId: Number,
        tipoUsuarioId: Number,
    },
    data() {
        return {
            formEditarInfo: {
                email_recuperacion: "",
                telefono_recuperacion: "",
                nombre: "",
                apellido: "",
            },
            showPassword: false,
            emailRegex: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
            passwordRegex:
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        };
    },
    computed: {
        seHanLlenadoCampos() {
            return (
                this.formEditarInfo.nombre ||
                this.formEditarInfo.apellido ||
                this.formEditarInfo.email_recuperacion ||
                this.formEditarInfo.telefono_recuperacion
            );
        },
    },

    mounted() {
        this.informacionStore();
    },

    methods: {
        cerrarModal() {
            this.$emit("update:mostrarEditarInfo", false);
            this.limpiarFormulario();
        },

        editarInformacion() {
            if (this.formEditarInfo.password) {
                if (
                    !this.formEditarInfo.email_recuperacion ||
                    !this.formEditarInfo.telefono_recuperacion
                ) {
                    this.$toast.error(
                        "Debe proporcionar un correo y un teléfono de recuperación para cambiar su contraseña."
                    );
                    return;
                }

            }

            const datosActualizar = {
                ...this.formEditarInfo,
                usuarioId: this.usuarioId,
                tipoUsuarioId: this.tipoUsuarioId,
            };

            this.$emit("editarInformacion", datosActualizar);
            this.limpiarFormulario();
        },

        limpiarFormulario() {
            this.formEditarInfo = {
                email_recuperacion: "",
                telefono_recuperacion: "",
                nombre: "",
                apellido: "",
            };
            this.$refs.formEditarInformacion.resetValidation();
        },

        informacionStore() {
            const usuario = this.$store.state.auth.usuario;

            if (usuario.tipo_usuario !== 2 && usuario.operador) {
                this.formEditarInfo.nombre = usuario.operador.nombre;
                this.formEditarInfo.apellido = usuario.operador.apellido;
                this.formEditarInfo.email_recuperacion = usuario.operador.email_recuperacion;
                this.formEditarInfo.telefono_recuperacion = usuario.operador.telefono_recuperacion
            } else {
                this.formEditarInfo.email_recuperacion = usuario.datosAfiliado.correo1;
                this.formEditarInfo.telefono_recuperacion = usuario.datosAfiliado.celular1;
            }
        }
    },
};
</script>
