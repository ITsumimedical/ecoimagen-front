<template>
    <div>
        <v-row>
            <v-col cols="12" sm="12" md="4">
                <v-card>
                    <!-- <v-alert text dense border="left" type="info" icon="mdi-account-edit" class="text-center">
                <b>PERFIL</b>
            </v-alert> -->
                    <v-card-text>
                        <v-row>
                            <v-col cols="12" sm="12" md="12" class="d-flex align-center justify-center">
                                <v-avatar size="150">
                                    <img :src="`https://ui-avatars.com/api/?name=${this.nombreUsuario}&background=0D8ABC&color=fff&size=150`"
                                        alt="Avatar" />

                                </v-avatar>
                            </v-col>

                        </v-row>

                        <v-row>
                            <v-col cols="12" sm="12" md="12">
                                <hr>
                            </v-col>
                        </v-row>


                        <v-row v-if="this.$store.state.auth.usuario.tipo_usuario !== 2" class="mx-2">
                            <v-col cols="12" sm="12" md="12">
                                <h2 class="text-center">Información Personal</h2>

                                <br>

                                <h3><v-icon color="primary">mdi-account</v-icon> {{
                                    $store.state.auth.usuario.operador.nombre +
                                    ' ' +
                                    $store.state.auth.usuario.operador.apellido }}</h3>
                                <br>

                                <h3><v-icon color="primary">mdi-card-account-details-outline</v-icon> {{
                                    $store.state.auth.usuario.operador.documento }}</h3>

                                <br>

                                <h3><v-icon color="primary">mdi-email</v-icon> {{ $store.state.auth.usuario.email }}</h3>

                                <br>

                                <h3><v-icon color="primary">mdi-email-sync</v-icon> {{ $store.state.auth.usuario.operador.email_recuperacion ?? 'No ha registrado un correo de recuperación' }} </h3>

                                <br>

                                <h3><v-icon color="primary">mdi-cellphone-cog</v-icon> {{ $store.state.auth.usuario.operador.telefono_recuperacion ?? 'No ha registrado un teléfono de recuperación' }}</h3>

                                <br>

                                <v-card-actions class="d-flex align-center justify-center">
                                    <v-btn small color="primary" @click="abrirModalEditarInformacion"><v-icon left
                                            small>mdi-reload</v-icon>Actualizar
                                        Informacion</v-btn>
                                </v-card-actions>

                            </v-col>


                        </v-row>

                        <!-- Sección Afiliados -->
                        <v-row dense v-if="this.$store.state.auth.usuario.tipo_usuario === 2" class="mx-2">
                            <v-col cols="12" sm="12" md="12">
                                <h2 class="text-center">Información Personal</h2>

                                <br>

                                <h3><v-icon color="primary">mdi-account</v-icon> {{
                                    $store.state.auth.usuario.datosAfiliado.primer_nombre +
                                    " " +
                                    ($store.state.auth.usuario.datosAfiliado.segundo_nombre ?? "")
                                    }}</h3>
                                <br>

                                <h3><v-icon color="warning">mdi-card-account-details-outline</v-icon> {{
                                    $store.state.auth.usuario.datosAfiliado.numero_documento }}</h3>

                                <br>

                                <h3><v-icon color="teal">mdi-email</v-icon> {{ $store.state.auth.usuario.email }}</h3>

                                <br>

                                <h3><v-icon color="red">mdi-email-sync</v-icon> {{
                                    $store.state.auth.usuario.datosAfiliado.correo1 ??
                                    "No ha registrado un correo de recuperación"
                                    }} </h3>

                                <br>

                                <h3><v-icon color="success">mdi-cellphone-cog</v-icon> {{
                                    $store.state.auth.usuario.datosAfiliado.celular1 ??
                                    "No ha registrado un teléfono de recuperación"
                                }}
                                </h3>

                                <br>

                                <v-card-actions class="d-flex align-center justify-center">
                                    <v-btn small color="success" @click="abrirModalEditarInformacion"><v-icon left
                                            small>mdi-reload</v-icon>Actualizar
                                        Informacion</v-btn>
                                </v-card-actions>

                            </v-col>

                            <v-col cols="1" md="1" sm="1">
                                <v-divider vertical></v-divider>
                            </v-col>
                        </v-row>

                    </v-card-text>
                </v-card>

            </v-col>

            <v-col cols="12" sm="12" md="8">

                <v-card v-if="this.$store.state.auth.usuario.tipo_usuario !== 2" class="mb-4">
                    <v-alert text dense border="left" type="primary" icon="mdi-account-edit" class="text-center">
                        <b>Mis Roles</b>
                    </v-alert>
                    <v-card-text>

                        <v-row dense>
                            <v-col cols="12" md="12" sm="12">
                                <p><b>{{rolesUsuario.map(r => r.name).join(', ')}}</b></p>
                            </v-col>
                        </v-row>
                    </v-card-text>
                </v-card>

                <v-card>
                    <v-alert text dense border="left" type="info" color="primary" icon="mdi-cog" class="text-center">
                        <b>Configuraciones</b>
                    </v-alert>
                    <v-card-text>
                        <v-row>
                            <v-col cols="12" sm="12" md="12">
                                <v-btn small color="primary" @click="modalCambiarContraseña = true"><v-icon small
                                        left>mdi-reload</v-icon> Cambiar
                                    Contraseña</v-btn>
                            </v-col>
                        </v-row>
                    </v-card-text>
                </v-card>

                <notificaciones-usuario class="mt-2"/>

            </v-col>
        </v-row>

        <v-dialog v-model="modalCambiarContraseña" max-width="800px">
            <v-card> 
                <v-alert text dense border="left" type="info" color="teal" icon="mdi-account-edit">
                    <b>Editar Información</b>
                </v-alert>
                <v-card-text>
                    <v-form ref="CambiarContrasena">
                    
                    <v-row>
                        <v-col cols="12" sm="12" md="12">
                            <v-text-field outlined dense label="Contraseña" v-model="formCambiarContrasena.password"
                                :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                                :type="showPassword ? 'text' : 'password'"
                                @click:append="showPassword = !showPassword" :rules="rules.caractPassword"></v-text-field>
                        </v-col>

                        <v-col cols="12" sm="12" md="12">
                            <v-text-field outlined dense label="Repetir ContraseÑa"
                                v-model="formCambiarContrasena.repetir_password"
                                :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                                :type="showPassword ? 'text' : 'password'" @click:append="showPassword = !showPassword"
                                :rules="[matchPassword]"></v-text-field>
                        </v-col>

                    </v-row>
                    </v-form>
                    

                    <v-card-actions>
                        <v-btn small color="error" @click="cerrarModalContraseña()"><v-icon small
                                left>mdi-close</v-icon>Cerrar</v-btn>
                        <v-btn small color="success" @click="cambiarContraseña()"><v-icon small
                                left>mdi-pencil</v-icon>Actualizar</v-btn>
                    </v-card-actions>
                </v-card-text>
            </v-card>
        </v-dialog>

        <EditarInformacionModal :mostrarEditarInfo.sync="modalEditarInfo" :usuarioId="usuarioId"
            :tipoUsuarioId="tipoUsuarioId" @editarInformacion="editarInformacion" />


    </div>
</template>
<script>
import EditarInformacionModal from "@/components/perfil/EditarInformacionModal.vue";
import { mapActions } from "vuex";
import NotificacionesUsuario from '../components/usuario/notificacionesUsuario.vue';

export default {
    components: {
        EditarInformacionModal,
        NotificacionesUsuario,
    },

    data() {
        return {
            formCambiarContrasena: {
                password: null,
                repetir_password: null,
            },
            modalCambiarContraseña: false,
            nombreUsuario: null,
            modalEditarInfo: false,
            usuarioId: null,
            tipoUsuarioId: null,
            loading: {
                selectorRoles: false,
            },
            headersRoles: [
                { text: "ID", value: "id" },
                { text: "Rol", value: "name" },
                { text: "Descripción", value: "descripcion" },
            ],
            rolesUsuario: [],
            showPassword: false,
             rules: {
            caractPassword: [
            v => !!v || "La contraseña es obligatoria",
            v => /^(?=.*[a-z])(?=.*[A-Z])(?=.*[^A-Za-z0-9\s]).{8,}$/.test(v) 
                || "Debe tener al menos 8 caracteres, una mayúscula, una minúscula y un caracter especial"
        ]
}

        };
    },

    computed: {

        matchPassword() {
            return (v) =>
                v === this.formCambiarContrasena.password || 'Las contraseñas no coinciden';
        },
    },


    mounted() {
        this.nombreUsuarioC();
        this.buscarRolesUsuario();
    },

    methods: {
        ...mapActions("app", ["setPreload"]),

        abrirModalEditarInformacion() {
            this.usuarioId = this.$store.state.auth.usuario.id;
            this.tipoUsuarioId = this.$store.state.auth.usuario.tipo_usuario;
            this.modalEditarInfo = true;
        },

        async editarInformacion(nuevaInfo) {
            try {
                this.setPreload(true);
                await this.$axios.post("usuarios/editarInfoPerfil", nuevaInfo)
                window.location.reload();
            } catch (error) {
                this.$toast.error("Ocurrió un error al actualizar la información");

            } finally {
                this.setPreload(false);
                this.modalEditarInfo = false;
            }

        },

        async nombreUsuarioC() {
            const usuario = this.$store.state.auth.usuario;

            if (!usuario) {
                return;
            }

            if (usuario.tipo_usuario !== 2 && usuario.operador) {
                this.nombreUsuario = `${usuario.operador.nombre} ${usuario.operador.apellido}`;
            } else if (usuario.datosAfiliado) {
                this.nombreUsuario = `${usuario.datosAfiliado.primer_nombre} ${usuario.datosAfiliado.primer_apellido || ''}`;
            } else {
                this.nombreUsuario = "Usuario";
            }
        },

        async buscarRolesUsuario() {
            try {
                if (this.$store.state.auth.usuario.tipo_usuario !== 2) {
                    const res = await this.$axios.get(`/usuarios/buscarRoles/${this.$store.state.auth.usuario.id}`)
                    this.rolesUsuario = res.data[0].roles;
                }
            } catch (error) {
                this.$toast.error("Ocurrió un error al cargar los roles");
            }
        },

        async cambiarContraseña() {

            if(!this.$refs.CambiarContrasena.validate()) {
                 this.$toast.error("Corrige los errores del formulario");
                return;
            }
            try {
                this.setPreload(true);
                await this.$axios.post('usuarios/cambioContrasena', this.formCambiarContrasena)
                this.$toast.success('¡ Contraseña Cambiada con Exito !')
                this.cerrarModalContraseña()
            } catch (error) {
                this.$toast.error('Ha ocurrido un Error al actualizar la Contraseña')
            } finally {
                this.setPreload(false);
            }
        },

        cerrarModalContraseña() {
            this.modalCambiarContraseña = false;
            this.limpiarContraseña();
            this.$refs.CambiarContrasena.resetValidation();
        },

        limpiarContraseña() {
            this.formCambiarContrasena = {
                password: null,
                repetir_password: null,
            }
        }




    },
};
</script>
