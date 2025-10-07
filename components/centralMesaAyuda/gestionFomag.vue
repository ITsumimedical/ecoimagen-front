<template>
    <v-card>
        <!-- Header -->
        <v-card-title class="d-flex align-center">
            <div class="d-flex align-center">
                <v-icon left large class="mr-2">mdi-comment-eye-outline</v-icon>
                Detalle de Solicitud - {{ solicitudSeleccionada?.id }}
            </div>

            <v-spacer></v-spacer>

            <v-chip label color="orange" text-color="white" class="mr-2">
                {{ solicitudSeleccionada?.estado?.nombre }}
            </v-chip>
            <v-chip label :color="solicitudSeleccionada?.categoria_mesa_ayuda?.prioridad?.nombre === 'ALTA' ? 'red' :
                solicitudSeleccionada?.categoria_mesa_ayuda?.prioridad?.nombre === 'MEDIA' ? 'blue' :
                    solicitudSeleccionada?.categoria_mesa_ayuda?.prioridad?.nombre === 'BAJA' ? 'yellow darken-2' :
                        'grey'" text-color="white" class="font-weight-bold mr-2">
                {{ solicitudSeleccionada?.categoria_mesa_ayuda?.prioridad?.nombre }}
            </v-chip>
        </v-card-title>

        <v-card-text>
            <v-container>
                <!-- Datos del solicitante -->
                <v-card-title class="d-flex align-center text-h6 font-weight-bold mb-2">
                    <v-icon color="primary" large class="mr-2">mdi-account</v-icon>
                    Datos del solicitante
                </v-card-title>
                <v-divider class="mb-4"></v-divider>

                <v-row dense>
                    <v-col cols="12" md="6">
                        <v-text-field label="ID" v-model="solicitudSeleccionada.id" readonly outlined dense />
                    </v-col>
                    <v-col cols="12" md="6">
                        <v-text-field label="Asunto" v-model="solicitudSeleccionada.asunto" readonly outlined dense />
                    </v-col>
                    <v-col cols="12" md="6">
                        <v-text-field label="Categoría"
                            :value="solicitudSeleccionada?.categoria_mesa_ayuda?.nombre || 'Sin categoría'" readonly
                            outlined dense />
                    </v-col>
                    <v-col cols="12" md="6">
                        <v-text-field label="Plataforma" v-model="solicitudSeleccionada.plataforma" readonly outlined
                            dense />
                    </v-col>
                    <v-col>
                        <v-text-field label="Prioridad"
                            :value="solicitudSeleccionada?.categoria_mesa_ayuda?.prioridad?.nombre || 'Sin prioridad'"
                            readonly outlined dense />
                    </v-col>
                    <v-col cols="12" md="6">
                        <v-text-field label="Fecha de Radicación" :value="fechaRadicacion" readonly outlined dense />
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

                <v-row v-if="historial.length">
                    <v-col cols="12" v-for="(h, index) in historial" :key="index">
                        <v-card outlined class="mb-3">
                            <v-card-title class="d-flex justify-space-between">
                                <div>
                                    <strong>{{ h.usuario }}</strong>
                                    <span class="grey--text text--darken-1 ml-2">{{ h.fecha }}</span>
                                </div>
                                <v-chip small color="blue" text-color="white">{{ h.tipo }}</v-chip>
                            </v-card-title>
                            <v-card-text>
                                <div>{{ h.observacion }}</div>
                            </v-card-text>
                        </v-card>
                    </v-col>
                </v-row>

                <v-row v-else>
                    <v-col cols="12">
                        <div class="pa-3 grey--text text--darken-1">No hay comentarios todavía</div>
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

                <v-row v-if="solicitudSeleccionada?.estado?.nombre !== 'Cerrado'">
                    <v-col cols="12" md="6">
                        <v-select label="Acción *" :items="acciones" v-model="accion" outlined dense />
                    </v-col>

                    <v-col cols="12" md="6" v-if="accion === 'Reasignar'">
                        <v-select label="Categoría *" :items="categorias"
                            v-model="formSolicitud.categoria_mesa_ayuda_id" item-text="nombre" item-value="id" outlined
                            dense />
                    </v-col>

                    <v-col cols="12"
                        v-if="accion === 'Solucionada' || accion === 'Comentario al Solicitante' || accion === 'Reasignar'">
                        <v-textarea label="Observación *" v-model="formSolicitud.motivo" outlined dense
                            :rules="[v => !!v || 'El motivo es obligatorio']" />
                    </v-col>

                    <v-col cols="12"
                        v-if="accion === 'Solucionada' || accion === 'Comentario al Solicitante'">
                        <v-file-input v-model="formSolicitud.archivos" label="Adjuntar archivos"
                            prepend-icon="mdi-paperclip" multiple outlined dense show-size />
                    </v-col>
                </v-row>
            </v-container>
        </v-card-text>

        <!-- Footer -->
        <v-divider></v-divider>
        <v-card-actions class="justify-end">
            <v-btn color="error" @click="cerrarModal()">Salir</v-btn>
            <v-btn color="success" @click="enviarGestion()">Enviar</v-btn>
        </v-card-actions>
    </v-card>
</template>

<script>
import { mapActions } from "vuex";

export default {
    props: {
        solicitudSeleccionada: Object,
        clienteId: Number
    },
    data() {
        return {
            acciones: ["Solucionada", "Comentario al Solicitante", "Reasignar"],
            accion: null,
            formSolicitud: { area: null, categoria_mesa_ayuda_id: null, motivo: "", archivos: [] },
            categorias: [],
            historial: [],
            adjuntos: [],
            dialogPrevisualizacion: false
        };
    },
    computed: {
        fechaRadicacion() {
            if (!this.solicitudSeleccionada?.created_at) return '';
            const date = new Date(this.solicitudSeleccionada.created_at);
            const dia = String(date.getDate()).padStart(2, '0');
            const mes = String(date.getMonth() + 1).padStart(2, '0');
            const anio = date.getFullYear();
            return `${dia}/${mes}/${anio}`;
        }
    },
    watch: {
        accion(valor) { if (valor === "Reasignar") this.listarCategorias(); },
        solicitudSeleccionada: {
            immediate: true,
            handler() {
                this.listarHistorial();
                this.consultarAdjuntos();
            }
        }
    },
    methods: {
        ...mapActions("app", ["setPreload"]),

        cerrarModal() {
            this.accion = null;
            this.formSolicitud = { area: null, categoria_mesa_ayuda_id: null, motivo: "", archivos: [] };
            this.$emit("close");
        },

        async listarCategorias() {
            try {
                this.setPreload(true);
                const res = await this.$axios.get("interoperabilidad-mesa-ayuda/listar-categorias-fomag");
                this.categorias = res.data;
            } catch { this.$toast.error("Ha ocurrido un error al listar las categorías"); }
            finally { this.setPreload(false); }
        },

        async listarHistorial() {
            if (!this.solicitudSeleccionada?.id) return;
            try {
                this.setPreload(true);
                const res = await this.$axios.get(
                    `interoperabilidad-mesa-ayuda/listar-comentarios-mesa-ayuda-fomag/${this.solicitudSeleccionada.id}`
                );
                this.historial = res.data;
            } catch { this.$toast.error("No se pudo cargar el historial de la solicitud."); }
            finally { this.setPreload(false); }
        },

        async enviarGestion() {
            try {
                this.setPreload(true);
                let mensaje = '';
                let archivosBase64 = [];
                if (this.formSolicitud.archivos && this.formSolicitud.archivos.length > 0) {
                    archivosBase64 = await Promise.all(
                        this.formSolicitud.archivos.map(file => this.convertirArchivoABase64(file))
                    );
                }

                switch (this.accion) {
                    case "Reasignar":
                        const data = {
                            accion: 55,
                            categoria_id: parseInt(this.formSolicitud.categoria_mesa_ayuda_id),
                            respuesta: this.formSolicitud.motivo,
                            esPropietario: false,
                            archivos: archivosBase64
                        };
                        const res = await this.$axios.post(
                            `interoperabilidad-mesa-ayuda/reasignar-mesa-ayuda-fomag/${this.solicitudSeleccionada?.id}`,
                            data
                        );
                        if (res?.data) {
                            this.solicitudSeleccionada.estado = res.data.estado;
                            this.solicitudSeleccionada.categoria_mesa_ayuda = res.data.categoria_mesa_ayuda;
                        }
                        mensaje = "La solicitud ha sido reasignada correctamente.";
                        break;

                    case "Comentario al Solicitante":
                        await this.$axios.post(
                            `interoperabilidad-mesa-ayuda/comentario-mesa-ayuda-fomag/${this.solicitudSeleccionada?.id}`,
                            {
                                motivo: this.formSolicitud.motivo,
                                archivos: archivosBase64
                            }
                        );
                        mensaje = "El comentario fue enviado correctamente.";
                        break;

                    case "Solucionada":
                        await this.$axios.post(
                            `interoperabilidad-mesa-ayuda/solucionar-mesa-ayuda-fomag/${this.solicitudSeleccionada?.id}`,
                            {
                                motivo: this.formSolicitud.motivo,
                                archivos: archivosBase64
                            }
                        );
                        mensaje = "La solicitud fue marcada como solucionada.";
                        break;
                }

                this.$toast.success(mensaje);
                this.cerrarModal();
            } catch (error) {
                console.log({ error });
                this.$toast.error("Ha ocurrido un error al procesar la solicitud.");
            } finally {
                this.setPreload(false);
            }
        },

        convertirArchivoABase64(file) {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = () => {
                    resolve({
                        nombre: file.name,
                        base64: reader.result.split(',')[1]
                    });
                };
                reader.onerror = error => reject(error);
            });
        },


        async consultarAdjuntos() {
            try {
                this.setPreload(true);
                const res = await this.$axios.post(
                    `interoperabilidad-mesa-ayuda/consultar-adjuntos-mesa-ayuda-fomag/${this.solicitudSeleccionada.id}`
                );
                this.adjuntos = res.data;
            } catch {
                this.$toast.error("Error al consultar adjuntos con URL");

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

        formatearFecha(fecha) {
            if (!fecha) return '';
            const date = new Date(fecha);
            const dia = String(date.getDate()).padStart(2, '0');
            const mes = String(date.getMonth() + 1).padStart(2, '0');
            const anio = date.getFullYear();
            return `${dia}/${mes}/${anio}`;
        },

        isImage(url) { return /\.(jpg|jpeg|png|gif)$/i.test(url); },
        isPDF(url) { return /\.pdf$/i.test(url); },
    }
};
</script>
