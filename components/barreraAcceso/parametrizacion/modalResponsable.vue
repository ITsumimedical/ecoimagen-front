<template>
    <v-dialog v-model="dialog" max-width="600px" persistent>
        <v-card>
            <v-card-title>
                <v-toolbar flat>
                    <v-toolbar-title>
                        <div class="d-flex align-center">
                            <img src="/images/ojo.svg" alt="" height="50px" width="50px">
                            <span class="ml-3">{{ esEditar ? 'Editar Responsable' : 'Crear Responsable'
                            }}</span>
                        </div>
                    </v-toolbar-title>
                </v-toolbar>
            </v-card-title>

            <v-card-text>
                <v-form ref="form" v-model="valid" lazy-validation>
                    <v-row dense>
                        <v-col cols="12" sm="12" md="12" v-if="esEditar">
                            <v-alert text dense border="left" color="gray">
                                <b>Usuario Actual:</b>
                                <p>{{ form.nombre }}</p>
                            </v-alert>
                        </v-col>
                        <v-col cols="12" md="6" ms="6">
                            <v-autocomplete v-model="form.user_id" :items="operadores" item-text="nombre"
                                item-value="user_id" :search-input.sync="buscarOperador"
                                no-data-text="Escribe al menos 4 letras para buscar" dense outlined label="Usuario: *"
                                :rules="rules.campoObligatorio" :loading="loadings.operadores"
                                @change="actualizarCorreo"></v-autocomplete>
                        </v-col>
                        <v-col cols="12" md="6" ms="6">
                            <v-text-field v-model="form.correo" label="Correo: *" outlined dense
                                :rules="rules.campoObligatorio" />
                        </v-col>
                        <v-col cols="12" sm="12" md="12" v-if="esEditar">
                            <v-alert text dense border="left" color="gray">
                                <b>Area Actual:</b>
                                <p>{{ responsable?.area_responsable?.nombre }}</p>
                            </v-alert>
                        </v-col>
                        <v-col cols="12" sm="12" md="12">
                            <v-autocomplete dense outlined :items="areas" item-text="nombre" item-value="id"
                                v-model="form.area_id" label="Area pertenece: *" :search-input.sync="buscarArea"
                                no-data-text="Escribe al menos 4 letras para buscar" :loading="loadings.areas"
                                :rules="rules.campoObligatorio">
                            </v-autocomplete>
                        </v-col>
                    </v-row>
                </v-form>
            </v-card-text>

            <v-card-actions>
                <v-spacer></v-spacer>
                <v-tooltip top>
                    <template v-slot:activator="{ on, attrs }">
                        <span v-bind="attrs" v-on="on">
                            <v-icon left>mdi-information-variant</v-icon>
                        </span>
                    </template>
                    <span><strong>¡Recuerda!</strong>
                        <li>Un responsable solo puede pertenecer a una única área a la que sea asignado.</li>
                    </span>
                </v-tooltip>
                <v-btn small color="error" @click="cerrar">
                    cerrar
                </v-btn>
                <v-btn small :color="esEditar ? 'warning' : 'success'" @click="guardar">
                    {{ esEditar ? 'Actualizar' : 'Crear' }}
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
import { mapActions } from 'vuex'
export default {
    props: {
        mostrarModal: Boolean,
        modo: String, // 'crear' o 'editar'
        responsable: Object,
    },

    data() {
        return {
            operadores: [],
            areas: [],
            loadings: {
                operadores: false,
                areas: false
            },
            buscarOperador: null,
            buscarArea: null,
            form: {
                correo: "",
                user_id: null,
                nombre: "",
                area_id: null
            },
            valid: false,
            rules: {
                campoObligatorio: [
                    v => !!v || "Este campo es obligatorio. Por favor, complétalo para continuar."
                ]
            }
        };
    },

    computed: {
        dialog: {
            get() {
                return this.mostrarModal;
            },
            set(val) {
                this.$emit("update:mostrarModal", val);
            },
        },
        esEditar() {
            return this.modo === "editar";
        },
    },

    watch: {
        dialog(val) {
            if (val) {
                if (this.esEditar && this.responsable) {
                    this.form = { ...this.responsable };
                } else {
                    this.form = { nombre: "" };
                }
            }
        },

        buscarOperador(val) {
            if (val && val.length == 4) {
                this.listarOperador();
            }
        },

        buscarArea(val) {
            if (val && val.length == 4) {
                this.listarAreaResponsables();
            }
        }
    },

    methods: {
        ...mapActions('app', ['setPreload']),

        guardar() {
            if (!this.$refs.form.validate()) {
                return
            }
            this.setPreload(true);
            const url = this.esEditar
                ? `/responsable-barrera-acceso/actualizar-responsable/${this.form.id}`
                : `/responsable-barrera-acceso/crear-responsable`;

            const metodo = this.esEditar ? "put" : "post";
            const data = {
                user_id: this.form.user_id,
                nombre: this.form.nombre,
                correo: this.form.correo,
                area_id: this.form.area_id
            }
            this.$axios[metodo](url, data)
                .then(() => {
                    this.$toast.success(this.esEditar ? "Responsable actualizado" : "Responsable creado");
                    this.$emit("update:mostrarModal", false);
                    this.$emit("listar");
                })
                .catch(() => {
                    this.$toast.error("Error al guardar");
                })
                .finally(() => {
                    this.setPreload(false);
                });
        },

        listarOperador() {
            const data = {
                nombre: this.buscarOperador
            }
            this.loadings.operadores = true;
            this.$axios.post('/operador/listar-operador-user-filtro', data).then(res => {
                this.operadores = res.data.map(operador => {
                    return {
                        ...operador,
                        user_id: operador.user_id,
                        nombre: `${operador.nombre} ${operador.apellido}`,
                        email: operador.email
                    };
                });
            }).catch(error => {
                this.$toast.error("Hubo un error al listar los operadores");
            }).finally(() => {
                this.loadings.operadores = false;
            });
        },

        listarAreaResponsables() {
            const data = {
                nombre: this.buscarArea
            }
            this.loadings.areas = true;
            this.$axios.post("/area-responsable-barrera-acceso/listar-area-responsables-activas", data)
                .then((res) => {
                    this.areas = res.data;
                })
                .catch((e) => {
                    this.$toast.error("Error al listar los responsables");
                })
                .finally(() => {
                    this.loadings.areas = false;
                })
        },

        actualizarCorreo() {
            const selectedUser = this.operadores.find(user => user.user_id === this.form.user_id);
            if (selectedUser) {
                this.form.correo = selectedUser.email;
                this.form.nombre = [selectedUser.nombre, selectedUser.apellido].filter(Boolean).join(' ') || '';
            }
        },

        cerrar() {
            this.dialog = false;
        },
    },
};
</script>
