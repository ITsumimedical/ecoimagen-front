<template>
    <v-card>
        <!-- Header -->
        <v-card-title class="d-flex justify-space-between align-center text-h5 font-weight-bold">
            <!-- Título principal -->
            <div class="d-flex align-center">
                <v-icon left large class="mr-2">mdi-comment-eye-outline</v-icon>
                Detalle de Solicitud - {{ solicitudSeleccionada?.id }}
            </div>
            <div v-if="solicitudSeleccionada?.estado?.nombre === 'Reasignada'">
                <v-chip label color="blue lighten-1" text-color="white" class="font-weight-bold mr-2">
                    Reasignada a: {{ solicitudSeleccionada.nombreCategoriaReasignada ||
                        solicitudSeleccionada.nombreCategoria }}
                </v-chip>
            </div>
        </v-card-title>

        <v-card-text>
            <v-container>
                <!-- Datos del solicitante -->
                <v-card-title class="d-flex align-center text-h6 font-weight-bold mb-2">
                    <v-icon color="primary" large class="mr-2">mdi-account</v-icon>
                    Datos del solicitante
                </v-card-title>
                <v-divider class="mb-4"></v-divider>

                <v-row>
                    <v-col cols="12" md="6">
                        <v-text-field label="Radicado" v-model="solicitudSeleccionada.id" readonly outlined dense />
                    </v-col>
                    <v-col cols="12" md="6">
                        <v-text-field label="Área" v-model="solicitudSeleccionada.area" readonly outlined dense />
                    </v-col>

                    <v-col cols="12" md="6">
                        <v-text-field label="Categoría" v-model="solicitudSeleccionada.nombreCategoria" readonly
                            outlined dense />
                    </v-col>

                    <v-col cols="12" md="6">
                        <v-text-field label="Radicado Por" v-model="solicitudSeleccionada.nombreoperador" readonly
                            outlined dense />
                    </v-col>

                    <v-col cols="12" md="6">
                        <v-text-field label="Correo Electrónico" v-model="solicitudSeleccionada.email" readonly outlined
                            dense />
                    </v-col>
                    <v-col cols="12" md="6">
                        <v-text-field label="Fecha de Radicación" v-model="solicitudSeleccionada.fechacreacion" readonly
                            outlined dense />
                    </v-col>

                    <v-col cols="12">
                        <v-text-field label="Asunto" v-model="solicitudSeleccionada.asunto" readonly outlined dense />
                    </v-col>

                    <v-col cols="12">
                        <v-textarea label="Descripción del Caso" v-model="solicitudSeleccionada.descripcion" readonly
                            auto-grow filled dense />
                    </v-col>
                </v-row>

                <!-- Comentarios -->
                <v-card-title class="d-flex align-center text-h6 font-weight-bold mb-2 mt-6">
                    <v-icon color="indigo" large class="mr-2">mdi-history</v-icon>
                    Respuestas anteriores
                </v-card-title>
                <v-divider class="mb-4"></v-divider>

                <v-row>
                    <v-col cols="12" v-if="comentariosSolicitante.length">
                        <v-card v-for="(comentario, i) in comentariosSolicitante" :key="i"
                            class="mb-3 pa-4 elevation-1">
                            <!-- Usuario -->
                            <div class="font-weight-bold text-subtitle-1 mb-2">
                                {{ comentario.usuario }}
                            </div>

                            <!-- Mensaje -->
                            <div class="mb-3 text-body-1">
                                {{ comentario.mensaje }}
                            </div>

                            <!-- Fecha destacada -->
                            <div class="text-subtitle-2 font-weight-bold blue--text text--darken-2">
                                {{ formatearFecha(comentario.fecha) }}
                            </div>
                        </v-card>
                    </v-col>

                    <v-col cols="12" v-else>
                        <div class="pa-3 grey--text text--darken-1">
                            No hay comentarios todavía
                        </div>
                    </v-col>
                </v-row>


                <!-- Adjuntos -->
                <v-card-title class="d-flex align-center text-h6 font-weight-bold mb-2 mt-6">
                    <v-icon color="teal" large class="mr-2">mdi-paperclip</v-icon>
                    Adjuntos
                </v-card-title>
                <v-divider class="mb-4"></v-divider>

                <v-col cols="12">
                    <div v-if="adjuntos.length">
                        <v-list dense>
                            <v-list-item v-for="(adj, i) in adjuntos" :key="i" class="d-flex align-center">
                                <v-list-item-avatar>
                                    <v-icon color="teal">mdi-file</v-icon>
                                </v-list-item-avatar>

                                <v-list-item-content>
                                    <v-list-item-title>{{ adj.nombre || `Adjunto ${i + 1}` }}</v-list-item-title>
                                    <v-list-item-subtitle>
                                        {{ formatearFecha(adj.created_at) }}
                                    </v-list-item-subtitle>
                                </v-list-item-content>

                                <v-list-item-action>
                                    <!-- Descargar -->
                                    <v-btn icon color="success" @click="descargarAdjunto(adj.url, adj.nombre)">
                                        <v-icon>mdi-download</v-icon>
                                    </v-btn>
                                </v-list-item-action>
                            </v-list-item>

                        </v-list>
                    </div>
                    <div v-else class="pa-3 grey--text text--darken-1">
                        Sin adjuntos para mostrar
                    </div>
                </v-col>


                <!-- Gestión -->
                <v-card-title v-if="solicitudSeleccionada?.estado?.nombre !== 'Cerrado'"
                    class="d-flex align-center text-h6 font-weight-bold mb-2 mt-6">
                    <v-icon color="deep-purple" large class="mr-2">mdi-clipboard-check-outline</v-icon>
                    Gestión de la solicitud
                </v-card-title>

                <v-divider v-if="solicitudSeleccionada?.estado?.nombre !== 'Cerrado'" class="mb-4"></v-divider>

                <v-row v-if="solicitudSeleccionada?.estado?.nombre !== 'Cerrado'">
                    <!-- Acción -->
                    <v-col cols="12" md="6">
                        <v-select label="Acción *" :items="accionesFiltradas" v-model="accion" outlined dense />
                    </v-col>
                    <v-col cols="12" md="6" v-if="accion === 'Reasignar'">
                        <v-select label="Categoría *" :items="categorias"
                            v-model="formSolicitud.categoria_mesa_ayuda_id" outlined dense item-text="nombre"
                            item-value="id" />
                    </v-col>
                    <v-col cols="12"
                        v-if="accion === 'Solucionada' || accion === 'Comentario al Solicitante' || accion === 'Reasignar'">
                        <v-textarea label="Observación *" v-model="formSolicitud.motivo" outlined dense
                            :rules="[v => !!v || 'El motivo es obligatorio']" />
                    </v-col>
                    <v-col cols="12" v-if="accion === 'Solucionada' || accion === 'Comentario al Solicitante'">
                        <v-file-input v-model="formSolicitud.archivos" label="Adjuntar archivos"
                            prepend-icon="mdi-paperclip" multiple outlined dense show-size />
                    </v-col>

                </v-row>


            </v-container>
        </v-card-text>
        <!-- Footer -->
        <v-divider></v-divider>
        <v-card-actions class="justify-end">
            <v-btn color="error" @click="closeDialog()">Salir</v-btn>
            <v-btn v-if="solicitudSeleccionada?.estado?.nombre !== 'Cerrado'" color="success" @click="enviarGestion">
                Enviar
            </v-btn>
        </v-card-actions>

    </v-card>
</template>

<script>
import { data } from "vue2-dropzone";
import { mapActions } from "vuex";

export default {
    props: {
        solicitudSeleccionada: {
            type: Object,
        },
        clienteId: {
            type: Number,
        },
        datosCliente: {
            type: Object,
        }
    },
    data() {
        return {
            acciones: ["Solucionada", "Comentario al Solicitante", "Reasignar"],
            accion: null,
            observacion: "",
            formSolicitud: {
                categoria_mesa_ayuda_id: null,
                area: null,
                motivo: null,
                archivos: []
            },
            categorias: [],
            comentariosSolicitante: [],
            adjuntos: [],
            mesaAyudaEncontrada: {},
            fechaMeta: null
        };
    },

    watch: {
        solicitudSeleccionada: {
            immediate: true,
            handler(newVal) {
                if (newVal?.id) {
                    this.cargarComentarios(newVal.id);
                    this.buscarMesaAyuda();
                }
            }
        },

        accion(valor) {
            if (valor === "Reasignar") {
                this.listarCategorias();
            }
        }
    },


    computed: {
        accionesFiltradas() {
            if (!this.solicitudSeleccionada?.estado?.nombre) return this.acciones;

            if (this.solicitudSeleccionada.estado.nombre === "Reasignada") {
                return ["Reasignar"];
            }

            return this.acciones;
        }
    },



    methods: {
        ...mapActions("app", ["setPreload"]),

        cargarComentarios(id) {
            this.$axios.get(`mesa-ayuda/comentario/${id}`).then(res => {
                this.comentariosSolicitante = res.data;
            });
        },

        async descargarAdjunto(url, nombre = "archivo") {
            if (!url) return;
            try {
                const response = await fetch(url, { method: "GET" });
                const blob = await response.blob();
                const link = document.createElement("a");
                link.href = URL.createObjectURL(blob);
                link.setAttribute("download", nombre);
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                URL.revokeObjectURL(link.href);
            } catch (error) {
                console.error("Error descargando archivo:", error);
                this.$toast.error("No se pudo descargar el adjunto");
            }
        },


        async buscarMesaAyuda() {
            try {
                const res = await this.$axios.get(
                    `mesa-ayuda/consultar-mesa-por-id/${this.solicitudSeleccionada?.id}`
                )

                this.mesaAyudaEncontrada = res.data;

                this.comentariosSolicitante = (res.data.seguimiento_actividades || []).map(item => ({
                    usuario: item.user_id,
                    mensaje: item.respuesta,
                    fecha: item.created_at
                }))

                const adjuntos = this.mesaAyudaEncontrada.adjuntos_mesa_ayuda ?? [];

                if (adjuntos) {
                    await this.consultarAdjuntos();
                }

            } catch (error) {
                this.$toast.error('Ha ocurrido un error al buscar la mesa de ayuda')
            }
        },

        closeDialog() {
            this.accion = null
            this.formSolicitud = {
                categoria_mesa_ayuda_id: null,
                area: null,
                motivo: null
            }
            this.$emit("close")
        },

        getEstadoColor(estado) {
            switch (estado) {
                case "Reasignada":
                    return "blue"
                case "Asignado":
                    return "orange"
                case "En seguimiento":
                    return "green"
                case "cerrado":
                    return "grey"
                default:
                    return "grey"
            }
        },

        async enviarGestion() {
            try {
                this.setPreload(true);

                const motivoFinal = this.formSolicitud.motivo && this.formSolicitud.motivo.trim() !== ""
                    ? this.formSolicitud.motivo.trim()
                    : "Sin observaciones";

                const formData = new FormData();
                formData.append("categoria_mesa_ayuda_id", this.formSolicitud.categoria_mesa_ayuda_id ?? "");
                formData.append("motivo", motivoFinal);

                if (this.formSolicitud.archivos && this.formSolicitud.archivos.length) {
                    this.formSolicitud.archivos.forEach((file, index) => {
                        formData.append(`archivos[${index}]`, file);
                    });
                }

                let url = "";
                let mensaje = "";

                switch (this.accion) {
                    case "Reasignar":
                        url = `mesa-ayuda/reasignar/${this.solicitudSeleccionada?.id}`;
                        mensaje = "La solicitud ha sido reasignada correctamente.";
                        break

                    case "Comentario al Solicitante":
                        url = `mesa-ayuda/comentario/${this.solicitudSeleccionada?.id}`;
                        formData.append("motivo", motivoFinal);
                        mensaje = "Comentario enviado al solicitante correctamente.";
                        break;

                    case "Solucionada":
                        url = `mesa-ayuda/solucionar/${this.solicitudSeleccionada?.id}`;
                        formData.append("respuesta", motivoFinal);
                        mensaje = "La solicitud ha sido solucionada correctamente.";
                        break;
                }

                await this.$axios.post(url, formData, {
                    headers: { "Content-Type": "multipart/form-data" }
                });

                await this.consultarAdjuntos();

                this.$toast.success(mensaje);
                this.closeDialog();

            } catch (error) {
                this.$toast.error("Ha ocurrido un error al procesar la solicitud.");
            } finally {
                this.setPreload(false);
            }
        },

        formatearFecha(fecha) {
            if (!fecha) return ''
            const d = new Date(fecha)
            return d.toLocaleDateString('es-CO', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            })
        },

        async consultarAdjuntos() {
            try {
                this.setPreload(true);
                const data = { mesa_id: this.mesaAyudaEncontrada?.id };
                const res = await this.$axios.post('/mesa-ayuda/consultarAdjuntosConUrl', data);
                this.adjuntos = res.data;
            } catch (error) {
                this.$toast.error("Ha ocurrido un error al consultar los adjuntos");
            }finally{
                this.setPreload(false);
            }
        },

        async enviarAdjuntos()
        {
            try {
                const data = {mesa_id: this.mesaAyudaEncontrada?.id};
                const res = await this.$axios.post('/mesa-ayuda/enviarAdjuntos', data);
                this.$adjunto = res.data;
            } catch (error) {
                this.$toast.error("Ha ocurrido un error al enviar el adjunto");
            }
        },

        async listarCategorias() {
            try {
                this.setPreload(true);
                const res = await this.$axios.get("CategoriaMesaAyuda/listarTodas");
                this.categorias = res.data
            } catch (error) {
                this.$toast.error("Ha ocurrido un error al listar las categorías");
            } finally {
                this.setPreload(false);
            }
        },

    },
};
</script>
