<template>
    <v-dialog v-model="mostarModalDevolucion" persistent max-width="1400px">
        <v-card>
            <v-card-title>
                <v-toolbar flat>
                    <v-toolbar-title>
                        <div class="d-flex align-center">
                            <img src="/images/ojo.svg" alt="" height="50px" width="50px">
                            <span>
                                DEVOLVER FICHA EPIDEMIOLÓGICA -
                                {{ `${infoAfiliadoRegistroFicha?.afiliado?.primer_nombre || ''}
                                ${infoAfiliadoRegistroFicha?.afiliado?.segundo_nombre || ''}
                                ${infoAfiliadoRegistroFicha?.afiliado?.primer_apellido || ''}
                                ${infoAfiliadoRegistroFicha?.afiliado?.segundo_apellido || ''}`.trim()
                                }}
                                ({{ infoAfiliadoRegistroFicha?.eventoSivigila?.nombre_evento }} - {{
                                    infoAfiliadoRegistroFicha?.dx }})
                            </span>
                        </div>
                    </v-toolbar-title>
                    <v-divider class="mx-4" inset vertical></v-divider>
                    <v-spacer></v-spacer>
                </v-toolbar>
            </v-card-title>
            <v-card-text>
                <v-form v-model="valid" lazy-validation ref="camposObligatoriosDevolucion">
                    <v-row>
                        <v-col cols="12" sm="6" md="12">
                            <v-text-field v-model="formDevolver.correo" outlined dense label="Correo medico registra: *"
                                :hint="`Correo registrado del medico: ${infoAfiliadoRegistroFicha?.emailMedico}`"
                                :rules="campoObligatorio"></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6" md="12">
                            <v-textarea v-model="formDevolver.observacion" outlined dense rows="1"
                                label="Observación: *" :rules="campoObligatorio"></v-textarea>
                        </v-col>
                    </v-row>
                </v-form>
            </v-card-text>
            <v-card-text class="py-0">
                <v-timeline align-top dense v-for="(observacionesDevolucion, i) in observacionesDevolucion" :key="i">
                    <v-timeline-item color="warning" small>
                        <v-row class="pt-1">
                            <v-col cols="3">
                                <strong> Devolucion de la ficha - {{
                                    $moment(observacionesDevolucion.created_at).format("DD-MM-YYYY HH:mm")
                                    }}</strong>
                            </v-col>
                            <v-col>
                                <strong>
                                    {{ observacionesDevolucion.user.operador ?
                                        observacionesDevolucion.user.operador.nombre + ' '
                                        +observacionesDevolucion.user.operador.apellido:
                                    observacionesDevolucion.user.email}}
                                </strong>
                                <div class="text-caption">
                                    {{ observacionesDevolucion.observacion }}
                                </div>
                            </v-col>
                        </v-row>
                    </v-timeline-item>
                </v-timeline>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="red" dark small @click="cerrarFormulario">Cerrar</v-btn>
                <v-btn color="warning" dark small @click="devolverFichaMedico">Devolver</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>
<script>
import { mapActions } from 'vuex';
export default {
    props: {
        mostarModalDevolucion: {
            type: Boolean,
            default: false
        },
        infoAfiliadoRegistroFicha: Object,
    },
    data() {
        return {
            formDevolver: {
                correo: null,
                observacion: null,
            },
            observacionesDevolucion: [],
            valid: true,
            campoObligatorio: [
                v => !!v || "Este campo es obligatorio, por favor completelo para continuar",
            ]
        }
    },

    watch: {
        infoAfiliadoRegistroFicha(newVal) {
            if (newVal) {
                this.formDevolver.correo = newVal.emailMedico || null;
            }
        }
    },

    methods: {
        ...mapActions('app', ['setPreload']),
        async devolverFichaMedico() {
            try {
                if (!this.$refs.camposObligatoriosDevolucion.validate()) {
                    return this.$toast.error('Por favor, complete todos los campos obligatorios')
                }
                const data = {
                    estado_id: 5,
                    observacion: this.formDevolver.observacion,
                    email_medico: this.formDevolver.correo,
                }
                const response = await this.$swal({
                    title: "Desea devolver la ficha?",
                    text: "Al aceptar este mensaje, la ficha se marcará como devuelta y se enviará un correo al médico notificando la devolución.",
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#28a745",
                    cancelButtonColor: "#d33",
                    confirmButtonText: "Aceptar",
                })
                if (response.value) {
                    this.setPreload(true);
                    await this.$axios.post(`/epidemiologia/devolver-ficha-medico/${this.infoAfiliadoRegistroFicha?.registroId}`, data)
                    if (this.$can('epidemiologia.verFichasPorCapa')) {
                        this.$emit("actualizarListado");
                    }
                    if (this.$can('epidemiologia.verTodasLasFichasEpidemiologicas')) {
                        this.$emit("actualizarListadoTodas");
                    }
                    await this.cerrarFormulario()
                    this.$toast.success("Ficha devuelta correctamente");
                }
            } catch (error) {
                this.$toast.error("Error al cambiar el estado del formulario");
            } finally {
                this.setPreload(false)
            }
        },

        listarObservacionsAnulacion() {
            this.$axios.get(`/epidemiologia/listar-observaciones-devolucion/${this.infoAfiliadoRegistroFicha?.registroId}`)
                .then(res => {
                    this.observacionesDevolucion = res.data
                })
        },

        cerrarFormulario() {
            this.$emit("update:mostarModalDevolucion", false);
            this.limpiar();
        },

        limpiar() {
            this.formDevolver = {
                correo: this.infoAfiliadoRegistroFicha?.emailMedico,
                observacion: null,
            }
        }
    }
}
</script>
