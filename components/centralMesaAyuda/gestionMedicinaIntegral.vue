<template>
    <v-card>
        <v-card-title class="d-flex align-center">
            <div class="d-flex align-center">
                <v-icon left large class="mr-2">mdi-comment-eye-outline</v-icon>
                Detalle de Solicitud - {{ solicitudSeleccionada?.id }}
            </div>

            <v-spacer></v-spacer>

            <v-chip label color="orange" text-color="white" class="mr-2">
                {{ solicitudSeleccionada?.nombreEstado }}
            </v-chip>
        </v-card-title>

        <v-divider></v-divider>

        <v-card-text>
            <v-container>
                <!-- Datos del solicitante -->
                <v-card-title class="d-flex align-center text-h6 font-weight-bold mb-2">
                    <v-icon color="primary" large class="mr-2">mdi-account</v-icon>
                    Datos del solicitante
                </v-card-title>

                <v-row dense>
                    <v-col cols="12" md="6">
                        <v-text-field label="ID" v-model="solicitudSeleccionada.id" readonly outlined dense />
                    </v-col>
                    <v-col cols="12" md="6">
                        <v-text-field label="Nombre del Operador" v-model="solicitudSeleccionada.nombreoperador"
                            readonly outlined dense />
                    </v-col>

                    <v-col cols="12" md="6">
                        <v-text-field label="Area" v-model="solicitudSeleccionada.area" readonly outlined dense />
                    </v-col>

                    <v-col cols="12" md="6">
                        <v-text-field label="Asunto" v-model="solicitudSeleccionada.asunto" readonly outlined dense />
                    </v-col>

                    <v-col cols="12" md="6">
                        <v-text-field label="Sede" v-model="solicitudSeleccionada.sedeNombre" readonly outlined dense />
                    </v-col>

                    <v-col cols="12" md="6">
                        <v-text-field label="Correo Electrónico" v-model="solicitudSeleccionada.email" readonly outlined
                            dense />
                    </v-col>

                    <v-col cols="12" md="6">
                        <v-text-field label="Contacto" v-model="solicitudSeleccionada.contacto" readonly outlined
                            dense />
                    </v-col>

                    <v-col cols="12" md="6">
                        <v-text-field label="Fecha de Creación"
                            :value="formatearFecha(solicitudSeleccionada.fechacreacion)" readonly outlined dense />
                    </v-col>

                    <v-col cols="12" md="12">
                        <v-textarea label="Descripcion" v-model="solicitudSeleccionada.descripcion" readonly outlined
                            dense auto-grow />
                    </v-col>
                </v-row>

                <!-- Comentarios -->
                <v-card-title class="d-flex align-center text-h6 font-weight-bold mb-2 mt-6">
                    <v-icon color="indigo" large class="mr-2">mdi-history</v-icon>
                    Respuestas anteriores
                </v-card-title>
                <v-divider class="mb-4"></v-divider>
                <v-row>
                    <v-col cols="12" v-if="historial.length === 0">
                        <div class="pa-3 grey--text text--darken-1">
                            No hay comentarios todavía
                        </div>
                    </v-col>


                    <v-col cols="12" v-for="(comentario, index) in historial" :key="index">
                        <v-card class="mb-2">
                            <v-card-title class="d-flex justify-space-between">
                                <span><strong>{{ comentario.usuario }}</strong></span>
                                <span class="grey--text text--darken-1">{{ formatearFecha(comentario.fecha) }}</span>
                            </v-card-title>
                            <v-card-text>{{ comentario.mensaje }}</v-card-text>
                        </v-card>
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
                                    <v-btn icon color="success" @click="descargarAdjunto(adj, adj.nombre)">
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
            <v-btn color="success" @click="enviarGestion">Enviar</v-btn>
        </v-card-actions>
    </v-card>
</template>

<script>
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
            fechaMeta: null,
            historial: [],
            fechaRadicacion: null
        };
    },

    watch: {
        solicitudSeleccionada: {
            immediate: true,
            handler(newVal) {
                if (newVal?.id) {
                    this.listarHistorial();
                    this.consultarAdjuntos();
                }
            }
        },

        accion(valor) {
            if (valor === "Reasignar") {
                this.listarCategorias();
                this.listarHistorial();
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

        verAdjunto(url) {
            if (!url) return;
            window.open(url, "_blank");
        },
        formatearFecha(fecha) {
            if (!fecha) return '';
            const date = new Date(fecha);
            const dia = String(date.getDate()).padStart(2, '0');
            const mes = String(date.getMonth() + 1).padStart(2, '0');
            const anio = date.getFullYear();
            return `${dia}/${mes}/${anio}`;
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
        async listarHistorial() {
            if (!this.solicitudSeleccionada?.id) return;
            try {
                this.setPreload(true);
                const res = await this.$axios.get(
                    `interoperabilidad-mesa-ayuda/listar-comentarios-mesa-ayuda-medicina-integral/${this.solicitudSeleccionada.id}`
                );

                this.historial = res.data.map(item => ({
                    usuario: `Usuario ${item.user_id}`,
                    mensaje: item.respuesta,
                    fecha: item.created_at
                }));
            } catch (error) {
                console.error(error);
                this.$toast.error("No se pudo cargar el historial de la solicitud.");
            } finally {
                this.setPreload(false);
            }
        },

        async enviarGestion() {
            try {
                this.setPreload(true);

                if (
                    (this.accion === "Reasignar" || this.accion === "Comentario al Solicitante" || this.accion === "Solucionada")
                    && !this.formSolicitud.motivo
                ) {
                    this.$toast.error("El motivo es obligatorio");
                    return;
                }

                let mensaje = '';

                switch (this.accion) {
                    case "Reasignar":
                        const data = {
                            accion: Number(55),
                            categoria_id: parseInt(this.formSolicitud.categoria_mesa_ayuda_id),
                            motivo: this.formSolicitud.motivo,
                            esPropietario: false
                        };
                        const res = await this.$axios.post(
                            `interoperabilidad-mesa-ayuda/reasignar-mesa-ayuda-medicina-integral/${this.solicitudSeleccionada?.id}`,
                            data
                        );

                        if (res?.data) {
                            this.solicitudSeleccionada.estado = res.data.estado;
                            this.solicitudSeleccionada.categoria_mesa_ayuda = res.data.categoria_mesa_ayuda;
                        }

                        mensaje = "La solicitud ha sido reasignada correctamente.";
                        break;

                    case "Comentario al Solicitante":
                    case "Solucionada":
                        let archivosBase64 = [];
                        if (this.formSolicitud.archivos.length) {
                            archivosBase64 = await Promise.all(this.formSolicitud.archivos.map(file => new Promise((resolve, reject) => {
                                const reader = new FileReader();
                                reader.readAsDataURL(file);
                                reader.onload = () => resolve({ nombre: file.name, base64: reader.result.split(',')[1] });
                                reader.onerror = error => reject(error);
                            })));
                        }

                        const payload = {
                            motivo: this.formSolicitud.motivo,
                            archivos: archivosBase64
                        };

                        let url = '';
                        if (this.accion === "Comentario al Solicitante") {
                            url = `interoperabilidad-mesa-ayuda/comentario-mesa-ayuda-medicina-integral/${this.solicitudSeleccionada?.id}`;
                            mensaje = "El comentario fue enviado correctamente.";
                        } else {
                            url = `interoperabilidad-mesa-ayuda/solucionar-mesa-ayuda-medicina-integral/${this.solicitudSeleccionada?.id}`;
                            mensaje = "La solicitud fue marcada como solucionada.";
                        }

                        await this.$axios.post(url, payload);
                        break;
                }

                this.$toast.success(mensaje);
                this.closeDialog();

            } catch (error) {
                console.log({ error });
                this.$toast.error("Ha ocurrido un error al procesar la solicitud.");
            } finally {
                this.setPreload(false);
            }
        },


        formatearFecha(fecha) {
            if (!fecha) return '';
            const date = new Date(fecha);
            const dia = String(date.getDate()).padStart(2, '0');
            const mes = String(date.getMonth() + 1).padStart(2, '0');
            const anio = date.getFullYear();
            return `${dia}/${mes}/${anio}`;
        },

        async listarCategorias() {
            try {
                this.setPreload(true);
                const res = await this.$axios.get(
                    "interoperabilidad-mesa-ayuda/listar-categorias-medicina-integral"
                );
                this.categorias = res.data;
            } catch (error) {
                this.$toast.error("Ha ocurrido un error al listar las categorías");
            } finally {
                this.setPreload(false);
            }
        },

        descargarAdjunto(url, nombre) {
            const link = document.createElement('a');
            link.href = url;
            link.download = nombre || 'archivo';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        },

        async convertirArchivosABase64(archivos) {
            const archivosBase64 = [];

            for (let i = 0; i < archivos.length; i++) {
                const file = archivos[i];
                const base64 = await new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.readAsDataURL(file);
                    reader.onload = () => resolve(reader.result.split(',')[1]); // solo la parte base64
                    reader.onerror = error => reject(error);
                });

                archivosBase64.push({
                    nombre: file.name,
                    base64
                });
            }

            return archivosBase64;
        },

        async consultarAdjuntos() {
            try {
                const res = await this.$axios.post(
                    `interoperabilidad-mesa-ayuda/consultar-adjuntos-mesa-ayuda-medicina-integral/${this.solicitudSeleccionada.id}`
                );

                this.adjuntos = res.data.map(adj => ({
                    ...adj,
                    created_at_formateada: this.formatearFecha(adj.created_at),
                    url: adj.url || adj.ruta
                }));

            } catch {
                this.$toast.error("Error al consultar adjuntos de Medicina Integral");
            }
        },


        isImage(url) { return /\.(jpg|jpeg|png|gif)$/i.test(url); },
        isPDF(url) { return /\.pdf$/i.test(url); },


    },
};
</script>
