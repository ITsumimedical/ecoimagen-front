<template>
    <div>
        <!-- Modal -->
        <v-dialog v-model="isOpen" max-width="1200px" persistent>
            <v-card>
                <v-alert text dense border="left" type="info" icon="mdi-file-account-outline">
                    <b>Detalles de la solicitud # {{ solicitud.id }}</b>
                </v-alert>
                <v-form ref="form" v-model="valid" lazy-validation>
                    <v-card-text>
                        <v-row dense>
                            <v-col cols="12" sm="12" md="12" v-if="solicitud.afiliado">
                                <AfiliadoComponente :afiliado="solicitud.afiliado" :modoDetalle="true"
                                    :modoEdicion="true" :mostrarClasificaciones="true"></AfiliadoComponente>
                            </v-col>

                            <v-col cols="12" sm="12" md="12">
                                <v-alert border="left" dense class="text-center" text color="warning"
                                    icon="mdi-message-alert-outline">
                                    <b>{{ solicitud.tipo_solicitud_red_vital?.nombre }}</b>
                                </v-alert>
                            </v-col>
                            <v-col cols="12" sm="12" md="12" v-if="solicitud.descripcion">
                                <v-textarea label="Observaciones del solicitante" dense v-model="solicitud.descripcion"
                                    auto-grow readonly></v-textarea>
                            </v-col>
                            <v-col cols="12" sm="12" md="12" v-if="solicitud.created_at">
                                <p><b>Fecha de Radicación:</b> {{ solicitud.created_at }}</p>
                            </v-col>
                            <v-col cols="12" sm="12" md="12" v-if="solicitud.tipo_solicitud_red_vital_id == 11">
                                <v-row>
                                    <v-col cols="12" sm="6" md="6">
                                        <v-text-field type="date" dense v-model="solicitud.fecha_inicio"
                                            label="Fecha Incial *" :rules="[
                                                () =>
                                                    !!solicitud.fecha_inicio || 'Este campo es requerido',
                                            ]"></v-text-field>
                                    </v-col>
                                    <v-col cols="12" sm="6" md="6">
                                        <v-text-field type="date" dense v-model="solicitud.fecha_final"
                                            label="Fecha Final *" :rules="[
                                                () =>
                                                    !!solicitud.fecha_final || 'Este campo es requerido',
                                            ]"></v-text-field>
                                    </v-col>
                                </v-row>
                            </v-col>
                            <v-col cols="12" sm="12" md="12" v-if="
                                solicitud.tipo_solicitud_red_vital_id == 26 &&
                                solicitud.beneficiario_radicacion
                            ">
                                <v-alert border="left" dense text color="info" icon="mdi-account-check">
                                    <v-row align="center">
                                        <v-col class="grow">
                                            <b>Datos del Beneficiario</b>
                                        </v-col>
                                        <v-col class="shrink">
                                            <v-btn small dark color="success" @click="registrarBeneficiario">
                                                Registrar Afiliado
                                                <v-icon right small>mdi-account-plus-outline</v-icon>
                                            </v-btn>
                                        </v-col>
                                    </v-row>
                                </v-alert>
                            </v-col>
                            <v-col cols="12" sm="12" md="12" v-if="
                                solicitud.tipo_solicitud_red_vital_id == 26 &&
                                solicitud.beneficiario_radicacion
                            ">
                                <v-row dense class="mx-2 mb-2">
                                    <v-col cols="12" sm="6" md="2">
                                        <span>
                                            <b>Tipo de Documento</b> <br />
                                            {{
                                                solicitud.beneficiario_radicacion[0]?.tipo_documento
                                                    ?.nombre
                                            }}
                                        </span>
                                    </v-col>
                                    <v-col cols="12" sm="6" md="2">
                                        <span>
                                            <b>Número Documento</b> <br />
                                            {{
                                                solicitud.beneficiario_radicacion[0]?.numero_documento
                                            }}
                                        </span>
                                    </v-col>
                                    <v-col cols="12" sm="6" md="2">
                                        <span>
                                            <b>Nombre Completo</b> <br />
                                            {{ solicitud.beneficiario_radicacion[0]?.primer_nombre }}
                                            {{ solicitud.beneficiario_radicacion[0]?.segundo_nombre }}
                                            {{
                                                solicitud.beneficiario_radicacion[0]?.primer_apellido
                                            }}
                                            {{
                                                solicitud.beneficiario_radicacion[0]?.segundo_apellido
                                            }}
                                        </span>
                                    </v-col>
                                    <v-col cols="12" sm="6" md="2">
                                        <span>
                                            <b>Sexo</b> <br />
                                            {{ solicitud.beneficiario_radicacion[0]?.sexo }}
                                        </span>
                                    </v-col>
                                    <v-col cols="12" sm="6" md="2">
                                        <span>
                                            <b>Fecha Nacimiento</b> <br />
                                            {{
                                                solicitud.beneficiario_radicacion[0]?.fecha_nacimiento
                                            }}
                                        </span>
                                    </v-col>
                                    <v-col cols="12" sm="6" md="2">
                                        <span>
                                            <b>Parentesco</b> <br />
                                            {{ solicitud.beneficiario_radicacion[0]?.parentesco }}
                                        </span>
                                    </v-col>
                                    <v-col cols="12" sm="6" md="2">
                                        <span>
                                            <b>Discapacidad</b> <br />
                                            {{ solicitud.beneficiario_radicacion[0]?.discapacidad }}
                                        </span>
                                    </v-col>
                                    <v-col cols="12" sm="6" md="2">
                                        <span>
                                            <b>Grado Discapacidad</b> <br />
                                            {{
                                                solicitud.beneficiario_radicacion[0]
                                                    ?.grado_discapacidad ?? "N/A"
                                            }}
                                        </span>
                                    </v-col>
                                    <v-col cols="12" sm="6" md="2">
                                        <span>
                                            <b>Departamento</b> <br />
                                            {{
                                                solicitud.beneficiario_radicacion[0]
                                                    ?.departamento_afiliacion?.nombre
                                            }}
                                        </span>
                                    </v-col>
                                    <v-col cols="12" sm="6" md="2">
                                        <span>
                                            <b>Municipio</b> <br />
                                            {{
                                                solicitud.beneficiario_radicacion[0]
                                                    ?.municipio_afiliacion?.nombre
                                            }}
                                        </span>
                                    </v-col>
                                    <v-col cols="12" sm="6" md="2">
                                        <span>
                                            <b>Dirección</b> <br />
                                            {{ solicitud.beneficiario_radicacion[0]?.direccion }}
                                        </span>
                                    </v-col>
                                    <v-col cols="12" sm="6" md="2">
                                        <span>
                                            <b>Teléfono</b> <br />
                                            {{ solicitud.beneficiario_radicacion[0]?.telefono }}
                                        </span>
                                    </v-col>
                                    <v-col cols="12" sm="6" md="2">
                                        <span>
                                            <b>Celular Principal</b> <br />
                                            {{ solicitud.beneficiario_radicacion[0]?.celular1 }}
                                        </span>
                                    </v-col>
                                    <v-col cols="12" sm="6" md="2">
                                        <span>
                                            <b>Celular Secundario</b> <br />
                                            {{ solicitud.beneficiario_radicacion[0]?.celular2 }}
                                        </span>
                                    </v-col>
                                    <v-col cols="12" sm="6" md="2">
                                        <span>
                                            <b>Correo Principal</b> <br />
                                            {{ solicitud.beneficiario_radicacion[0]?.correo1 }}
                                        </span>
                                    </v-col>
                                    <v-col cols="12" sm="6" md="2">
                                        <span>
                                            <b>Correo Secundario</b> <br />
                                            {{ solicitud.beneficiario_radicacion[0]?.correo2 }}
                                        </span>
                                    </v-col>
                                    <v-col cols="12" sm="6" md="2">
                                        <span>
                                            <b>Tipo Afiliado</b> <br />
                                            {{
                                                solicitud.beneficiario_radicacion[0]?.tipo_afiliado
                                                    ?.nombre
                                            }}
                                        </span>
                                    </v-col>
                                    <v-col cols="12" sm="6" md="2">
                                        <span>
                                            <b>Tipo Afiliación</b> <br />
                                            {{
                                                solicitud.beneficiario_radicacion[0]?.tipo_afiliacion
                                                    ?.nombre
                                            }}
                                        </span>
                                    </v-col>
                                    <v-col cols="12" sm="6" md="2">
                                        <span>
                                            <b>Entidad</b> <br />
                                            {{
                                                solicitud.beneficiario_radicacion[0]?.entidad?.nombre
                                            }}
                                        </span>
                                    </v-col>
                                    <v-col cols="12" sm="6" md="2">
                                        <span>
                                            <b>Tipo de Beneficiario</b> <br />
                                            {{
                                                solicitud.beneficiario_radicacion[0]?.tipo_beneficiario
                                                    ?.nombre
                                            }}
                                        </span>
                                    </v-col>
                                </v-row>
                            </v-col>
                            <v-col cols="12" sm="12" md="12">
                                <v-alert border="left" dense class="text-center" text color="blue-grey"
                                    icon="mdi-attachment">
                                    <b>Archivos Adjuntos</b>
                                </v-alert>
                            </v-col>
                            <v-col cols="12" sm="12" md="12" v-if="solicitud.adjunto_radicado" style="
                  display: flex;
                  gap: 0.5rem;
                  flex-wrap: wrap;
                  justify-content: center;
                  margin-bottom: 1rem;
                ">
                                <v-btn v-for="(adjunto, index) in solicitud.adjunto_radicado" :key="index" dark
                                    color="blue-grey" small @click="consultarAdjunto(adjunto.ruta)">
                                    Adjunto {{ index + 1 }}
                                    <v-icon right small>mdi-download</v-icon>
                                </v-btn>
                            </v-col>
                            <v-row dense>
                                <v-col cols="12" sm="6" md="6">
                                    <v-alert border="left" dense text color="blue darken-1"
                                        icon="mdi-message-text-fast">
                                        <b>Comentarios del Solicitante</b>
                                    </v-alert>
                                    <div class="mx-1" v-for="(gestion, i) in comentariosSolicitante" :key="i">
                                        <v-divider></v-divider>
                                        <span>
                                            <b>Usuario</b>
                                            <br />
                                            {{
                                                [solicitud?.afiliado?.primer_nombre,
                                                    solicitud?.afiliado?.segundo_nombre,
                                                    solicitud?.afiliado?.primer_apellido,
                                            solicitud?.afiliado?.segundo_apellido]
                                            .filter(Boolean)
                                            .join(' ') || '-'
                                            }}
                                        </span>
                                        <br />
                                        <span>
                                            <b>Fecha</b>
                                            <br />
                                            {{ gestion?.created_at }}
                                        </span>
                                        <br />
                                        <span>
                                            <b>Comentarios</b>
                                            <br />
                                            {{ gestion?.motivo }}
                                        </span>
                                        <v-divider></v-divider>
                                    </div>
                                </v-col>

                                <v-col cols="12" sm="6" md="6">
                                    <v-alert border="left" dense text color="blue darken-1"
                                        icon="mdi-message-text-fast">
                                        <b>Comentarios de la Gestión</b>
                                    </v-alert>
                                    <div class="mx-1" v-for="(gestion, i) in comentariosGestion" :key="i">
                                        <v-divider></v-divider>
                                        <span>
                                            <b>Funcionario</b>
                                            <br />
                                            {{
                                                [gestion?.user?.operador?.nombre,
                                                gestion?.user?.operador?.apellido]
                                                    .filter(Boolean)
                                                    .join(' ') || '-'
                                            }}
                                        </span>
                                        <br />
                                        <span>
                                            <b>Fecha</b>
                                            <br />
                                            {{ gestion?.created_at }}
                                        </span>
                                        <br />
                                        <span>
                                            <b>Comentarios</b>
                                            <br />
                                            {{ gestion?.motivo }}
                                        </span>
                                        <v-divider></v-divider>
                                    </div>
                                </v-col>
                            </v-row>

                            <v-col cols="12" sm="12" md="12">
                                <v-alert border="left" dense class="text-center" text color="green darken-1"
                                    icon="mdi-gesture-double-tap">
                                    <b>Acciones</b>
                                </v-alert>
                            </v-col>
                            <v-col cols="12" sm="6" md="6">
                                <v-autocomplete label="Acción" dense v-model="gestionSolicitud.accion"
                                    :items="opcionesAcciones" item-text="text" return-object
                                    :rules="[(v) => !!v || 'Acción es requerida']">
                                </v-autocomplete>
                            </v-col>
                            <v-col cols="12" sm="6" md="6">
                                <v-file-input label="Adjuntos" dense multiple small-chips
                                    v-model="gestionSolicitud.adjuntos">
                                </v-file-input>
                            </v-col>
                            <v-col cols="12" sm="12" md="12" v-if="
                                gestionSolicitud.accion.id === 1 ||
                                gestionSolicitud.accion.id === 2
                            ">
                                <v-switch dense v-model="gestionSolicitud.estaGestionando" color="success"
                                    label="Está gestionado?">
                                </v-switch>
                            </v-col>
                            <v-col cols="12" sm="12" md="12">
                                <v-textarea dense auto-grow v-model="gestionSolicitud.observacion"
                                    v-if="gestionSolicitud.accion !== 'Asignar'" label="Observaciones de la Gestión"
                                    :rules="[(v) => !!v || 'Observación es requerida']">
                                </v-textarea>
                            </v-col>
                        </v-row>
                    </v-card-text>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="error" dark @click="close">Cerrar</v-btn>
                        <v-btn color="success" dark @click="enviarGestion">Guardar</v-btn>
                    </v-card-actions>
                </v-form>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>
import AfiliadoComponente from "~/components/afiliado/FormularioAfiliadoComponente.vue";

export default {
    name: "ModalDetallesAsignadas",
    props: {
        isOpen: {
            type: Boolean,
            required: true,
        },
        solicitud: {
            type: Object,
            required: true,
        },
    },
    components: {
        AfiliadoComponente,
    },
    data() {
        return {
            valid: false,
            opcionesAcciones: [
                {
                    id: 1,
                    text: "Comentarios al Solicitante",
                },
                {
                    id: 2,
                    text: "Comentarios Internos",
                },
                {
                    id: 3,
                    text: "Devolver",
                },
                {
                    id: 4,
                    text: "Respuesta",
                },
            ],
            gestionSolicitud: {
                accion: {
                    id: null,
                    text: null,
                },
                observacion: " ",
                estaGestionando: false,
                adjuntos: [],
                solicitud_id: null,
                documento_afiliado: null,
            },
        };
    },
    computed: {
        comentariosSolicitante() {
            return this.solicitud?.gestion?.filter(
                (gestion) => parseInt(gestion.user?.tipo_usuario_id) === 2
            );
        },
        comentariosGestion() {
            return this.solicitud?.gestion?.filter(
                (gestion) => parseInt(gestion.user?.tipo_usuario_id) !== 2
            );
        },
    },
    methods: {
        close() {
            this.resetForm();
            this.$emit("close");
        },

        resetForm() {
            this.gestionSolicitud = {
                accion: {
                    id: null,
                    text: null,
                },
                observacion: " ",
                estaGestionando: false,
                adjuntos: [],
                solicitud_id: null,
            };
        },

        async consultarAdjunto(ruta) {
            try {
                let adj = await this.$adjuntos(ruta);
                let blob = new Blob([adj[1]], {
                    type: adj[0],
                });
                let link = document.createElement("a");
                link.href = window.URL.createObjectURL(blob);
                window.open(link.href, "_blank");
            } catch (error) {
                console.log(error.Response);
            }
        },

        enviarGestion() {
            if (this.$refs.form.validate()) {
                this.gestionSolicitud.solicitud_id = this.solicitud.id;
                this.gestionSolicitud.documento_afiliado =
                    this.solicitud.afiliado.documento_afiliado;
                this.gestionSolicitud.fecha_inicio = this.solicitud.fecha_inicio;
                this.gestionSolicitud.fecha_final = this.solicitud.fecha_final;
                this.$emit("enviarGestion", this.gestionSolicitud);
                this.$emit("close");
                this.resetForm();
            } else {
                this.$toast.error("Por favor, complete los campos requeridos");
            }
        },

        registrarBeneficiario() {
            const infoBeneficiario = {
                afiliado: this.solicitud.afiliado,
                beneficiario: this.solicitud.beneficiario_radicacion,
            };
            this.$emit("registrarBeneficiario", infoBeneficiario);
        },
    },
};
</script>
