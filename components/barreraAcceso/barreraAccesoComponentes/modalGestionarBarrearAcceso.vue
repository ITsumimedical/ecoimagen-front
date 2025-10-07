<template>
    <div>
        <v-dialog v-model="mostrarModal" max-width="1000px" persistent>
            <v-card>
                <v-card-title>
                    <v-toolbar flat>
                        <v-toolbar-title>
                            <div class="d-flex align-center">
                                <img src="/images/ojo.svg" alt="" height="50px" width="50px">
                                <span>Gestionar N° {{ barreraSelecionada?.id }}</span>
                            </div>
                        </v-toolbar-title>
                    </v-toolbar>
                </v-card-title>
                <v-card-text>
                    <v-row>
                        <v-row dense>
                            <v-col cols="12" md="12" sm="12">
                                <EditarAfiliadoComponente v-if="barreraSelecionada?.afiliado"
                                    :afiliado="barreraSelecionada?.afiliado" />
                            </v-col>
                            <v-col cols="12" md="12" sm="12" class="my-4">
                                <v-divider></v-divider>
                            </v-col>
                        </v-row>
                    </v-row>
                    <v-form>
                        <v-row dense>
                            <v-col cols="12" md="12" sm="12">
                                <v-alert text dense color="blue-grey" border="left" type="info"
                                    icon="mdi-file-document-alert-outline" class="text-center">
                                    <b>Detalles de la Radicación</b>
                                </v-alert>
                            </v-col>
                            <v-col cols="12" md="4" sm="4">
                                <v-text-field dense outlined label="Nombre - Quien Registra" :value="barreraSelecionada?.user_crea
                                    ? [barreraSelecionada.user_crea.operador?.nombre, barreraSelecionada.user_crea.operador?.apellido]
                                        .filter(Boolean)
                                        .join(' ')
                                    : 'SIN PERSONA REGISTRA'" readonly>
                                </v-text-field>
                            </v-col>
                            <v-col cols="12" md="4" sm="4">
                                <v-text-field dense outlined label="N° Documento - Quien Registra" :value="barreraSelecionada?.user_crea?.operador?.documento || 'SIN DOCUMENTO'
                                    " readonly>
                                </v-text-field>
                            </v-col>
                            <v-col cols="12" md="4" sm="4">
                                <v-text-field dense outlined label="Correo - Quien Registra" :value="barreraSelecionada?.user_crea?.email || 'SIN CORREO'
                                    " readonly>
                                </v-text-field>
                            </v-col>
                            <v-col cols="12" md="4" sm="4"
                                v-if="barreraSelecionada?.estado_id === 17 || barreraSelecionada?.estado_id === 5">
                                <v-text-field dense outlined label="Nombre - Quien Cierra" :value="barreraSelecionada?.user_cierra
                                    ? [barreraSelecionada.user_cierra.operador?.nombre, barreraSelecionada.user_cierra.operador?.apellido]
                                        .filter(Boolean)
                                        .join(' ')
                                    : 'SIN PERSONA CIERRA'" readonly>
                                </v-text-field>
                            </v-col>
                            <v-col cols="12" md="4" sm="4"
                                v-if="barreraSelecionada?.estado_id === 17 || barreraSelecionada?.estado_id === 5">
                                <v-text-field dense outlined label="N° Documento - Quien Cierra" :value="barreraSelecionada?.user_cierra?.operador?.documento || 'SIN DOCUMENTO'
                                    " readonly>
                                </v-text-field>
                            </v-col>
                            <v-col cols="12" md="4" sm="4"
                                v-if="barreraSelecionada?.estado_id === 17 || barreraSelecionada?.estado_id === 5">
                                <v-text-field dense outlined label="Correo - Quien Cierra" :value="barreraSelecionada?.user_cierra?.email || 'SIN CORREO'
                                    " readonly>
                                </v-text-field>
                            </v-col>
                            <v-col cols="12" md="6" sm="6" v-if="barreraSelecionada?.afiliado">
                                <v-text-field dense outlined label="Nombre Afiliado" :value="nombreAfiliadoSeleccionado"
                                    readonly />
                            </v-col>
                            <v-col cols="12" md="6" sm="6" v-if="barreraSelecionada?.afiliado">
                                <v-text-field dense outlined label="Documento Afiliado" :value="barreraSelecionada?.afiliado?.numero_documento || 'SIN DOCUMENTO'
                                    " readonly>
                                </v-text-field>
                            </v-col>
                            <v-col cols="12" md="12" sm="12" v-if="barreraSelecionada?.rep">
                                <v-text-field dense outlined label="Centro Atención" :value="barreraSelecionada?.rep?.nombre || 'SIN DOCUMENTO'
                                    " readonly>
                                </v-text-field>
                            </v-col>
                            <v-col cols="12" md="12" sm="12">
                                <v-autocomplete dense outlined label="Tipo Barrera Acceso" :items="barreras"
                                    item-text="nombre" return-object :loading="loadings.barrera" v-model="form.barrera"
                                    :readonly="barreraSelecionada?.estado_id != 10">
                                </v-autocomplete>
                            </v-col>
                            <v-col cols="12" md="12" sm="12">
                                <v-textarea filled label="Observación" v-model="form.observacion"
                                    :readonly="barreraSelecionada?.estado_id != 10">
                                </v-textarea>
                            </v-col>
                            <v-col cols="12" md="12" sm="12"
                                v-if="barreraSelecionada?.estado_id === 15 || barreraSelecionada?.estado_id === 17 || barreraSelecionada?.estado_id === 5 || barreraSelecionada?.estado_id === 18">
                                <v-textarea filled label="Observación Cierre"
                                    :value="barreraSelecionada?.observacion_cierre" readonly>
                                </v-textarea>
                            </v-col>
                            <v-col cols="12" md="12" sm="12"
                                v-if="barreraSelecionada?.estado_id === 17 || barreraSelecionada?.estado_id === 5">
                                <v-textarea filled label="Observación Solucion"
                                    :value="barreraSelecionada?.observacion_solucion" readonly>
                                </v-textarea>
                            </v-col>
                            <v-col cols="12" sm="6" md="6">
                                <v-checkbox v-model="form.barrera_general" label="¿Es una barrera General?"
                                    :disabled="true"></v-checkbox>
                            </v-col>
                            <v-col cols="12" sm="6" md="6">
                                <v-checkbox v-model="form.prioridad" label="¿Es prioritario?"
                                    :disabled="barreraSelecionada?.estado_id != 10"></v-checkbox>
                            </v-col>
                            <v-col cols="12" md="12" sm="12" v-if="barreraSelecionada?.estado_id === 10">
                                <v-btn small color="warning" @click="actualizarBarrera()">
                                    MODIFICAR / ACTUALIZAR
                                </v-btn>
                            </v-col>
                            <v-col cols="12" md="12" sm="12" class="my-4">
                                <v-divider></v-divider>
                            </v-col>
                            <template v-if="barreraSelecionada?.adjuntos?.length > 0">
                                <v-col cols="12" md="12" sm="12" style="
                                        display: flex;
                                        flex-wrap: wrap;
                                        gap: 0.5rem;
                                        justify-content: center;
                                    ">
                                    <v-btn small dark color="blue-grey" v-for="adjunto in barreraSelecionada.adjuntos"
                                        :key="adjunto.id" @click="consultarAdjunto(adjunto.ruta)">
                                        {{ adjunto.nombre }}
                                    </v-btn>
                                </v-col>
                            </template>
                            <template v-else>
                                <v-col cols="12" md="12" sm="12" align="center">
                                    <span>Sin adjuntos para mostrar</span>
                                </v-col>
                            </template>
                            <v-col cols="12" md="12" sm="12" class="my-4">
                                <v-divider></v-divider>
                            </v-col>
                        </v-row>
                    </v-form>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-tooltip top v-if="barreraSelecionada?.estado_id != 17 || barreraSelecionada?.estado_id != 5">
                        <template v-slot:activator="{ on, attrs }">
                            <span v-bind="attrs" v-on="on">
                                <v-icon left>mdi-information-variant</v-icon>
                            </span>
                        </template>
                        <span>Selecciona una de las siguientes acciones para continuar con la gestión:
                            <li v-if="barreraSelecionada?.estado_id == 10"><b>Solucionar/Anular:</b> Marca el caso como
                                resuelto o
                                anulado, según corresponda</li>
                            <li v-if="barreraSelecionada?.estado_id == 10"><b>Asignar:</b> Designa el caso a los
                                responsable para su
                                seguimiento o resolución</li>
                            <li v-if="barreraSelecionada?.estado_id == 6"><b>Dar Respuesta:</b> Marca el caso como
                                pre-solucionado o
                                anulado, según corresponda</li>
                            <li v-if="barreraSelecionada?.estado_id == 15"><b>Corregir Respuesta:</b> Corrige la
                                respuesta debido a la
                                reasignacion de la barrera para poder solucionarla</li>
                            <li
                                v-if="barreraSelecionada?.estado_id == 6 || barreraSelecionada?.estado_id == 15 || barreraSelecionada?.estado_id == 18">
                                <b>Reasignar:</b> Designa el caso a los nuevos responsable para su seguimiento o
                                resolución
                            </li>
                        </span>
                    </v-tooltip>
                    <v-btn small color="error" @click="cerrarModal">
                        CERRAR
                    </v-btn>
                    <v-btn v-if="barreraSelecionada?.estado_id === 10 || barreraSelecionada?.estado_id === 18" small
                        color="success" @click="abrirModalSolucionar()">SOLUCIONAR/ANULAR</v-btn>
                    <v-btn v-if="barreraSelecionada?.estado_id === 10" small color="primary"
                        @click="abrirModalAsignar()">ASIGNAR</v-btn>
                    <v-btn
                        v-if="barreraSelecionada?.estado_id === 6 || barreraSelecionada?.estado_id === 15 || barreraSelecionada?.estado_id === 18"
                        small color="primary" @click="abrirModalReasignar()">REASIGNAR</v-btn>
                    <v-btn v-if="barreraSelecionada?.estado_id === 6" small color="success"
                        @click="abrirModalPresolucionado()">DAR
                        RESPUESTA</v-btn>
                    <v-btn v-if="barreraSelecionada?.estado_id === 15" small color="warning"
                        @click="abrirModalReasignadoPresolucion()">CORREGIR RESPUESTA</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <ModalSolucionar :mostrarModalSolucionar.sync="mostrarModalSolucionar" :barreraSelecionada="barreraSelecionada"
            @cerrarModalPadre="cerrarModal"></ModalSolucionar>
        <ModalPresolucionado :mostrarModalPresolucionadas.sync="mostrarModalPresolucionadas"
            :barreraSelecionada="barreraSelecionada" @cerrarModalPadre="cerrarModal"></ModalPresolucionado>
        <ModalAsignar :mostrarModalAsignar.sync="mostrarModalAsignar" :barreraSelecionada="barreraSelecionada"
            @cerrarModalPadre="cerrarModal"></ModalAsignar>
        <ModalReasignar :mostrarModalReasignar.sync="mostrarModalReasignar" :barreraSelecionada="barreraSelecionada"
            @cerrarModalPadre="cerrarModal"></ModalReasignar>
        <ModalCorregirRespuesta :mostrarModalReasignadoPresolucion.sync="mostrarModalReasignadoPresolucion"
            :barreraSelecionada="barreraSelecionada" @cerrarModalPadre="cerrarModal"></ModalCorregirRespuesta>
    </div>
</template>
<script>
import EditarAfiliadoComponente from '~/components/afiliado/FormularioAfiliadoComponente.vue';
import ModalAsignar from './modalAsignar.vue';
import ModalSolucionar from './modalSolucionar.vue';
import { mapActions } from 'vuex'
import ModalReasignar from './modalReasignar.vue';
import ModalPresolucionado from './modalPresolucionado.vue';
import ModalCorregirRespuesta from './modalCorregirRespuesta.vue';

export default {
    components: {
        EditarAfiliadoComponente,
        ModalAsignar,
        ModalSolucionar,
        ModalReasignar,
        ModalPresolucionado,
        ModalCorregirRespuesta
    },

    props: {
        mostrarModal: {
            type: Boolean,
            default: false,
        },
        barreraSelecionada: Object,
    },

    data() {
        return {
            nombreCompleto: '',
            mostrarModalSolucionar: false,
            mostrarModalAsignar: false,
            mostrarModalReasignar: false,
            mostrarModalPresolucionadas: false,
            mostrarModalReasignadoPresolucion: false,
            barreras: [],
            barrerasCargadas: false,
            loadings: {
                barrera: false
            },
            form: {
                barrera: '',
                observacion: '',
                observacion_cierre: '',
                barrera_general: false,
                prioridad: false
            }
        }
    },

    watch: {
        'barreraSelecionada'(newVal) {
            if (newVal && this.barreraSelecionada) {
                this.form.barrera = this.barreraSelecionada?.barrera;
                this.form.observacion = this.barreraSelecionada?.observacion;
                this.form.observacion_cierre = this.barreraSelecionada?.observacion_cierre;
                this.form.barrera_general = this.barreraSelecionada?.barrera_general;
                this.form.prioridad = this.barreraSelecionada?.prioridad;
            }
        }
    },

    mounted() {
        this.listarTiposBarrerasAcceso();
    },

    computed: {
        nombreAfiliadoSeleccionado() {
            const a = this.barreraSelecionada?.afiliado || {};
            return [
                a.primer_nombre,
                a.segundo_nombre,
                a.primer_apellido,
                a.segundo_apellido
            ]
                .filter(Boolean)
                .join(' ');
        }
    },

    methods: {
        ...mapActions('app', ['setPreload']),
        listarTiposBarrerasAcceso() {
            if (this.barrerasCargadas) return;
            this.loadings.barrera = true;
            this.$axios.get(
                "/tipo-barrera-acceso/listar-tipos-barrera_acceso-activos")
                .then((res) => {
                    this.barreras = res.data;
                    this.barrerasCargadas = true;
                })
                .catch((e) => {
                    this.$toast.error("Error al listar los tipos de barreras acceso");
                })
                .finally(() => {
                    this.loadings.barrera = false;
                })
        },

        actualizarBarrera() {
            this.setPreload(true);
            const data = {
                tipo_barrera_acceso_id: this.form.barrera.id,
                barrera: this.form.barrera.nombre,
                observacion: this.form.observacion,
                prioridad: this.form.prioridad,
            }
            this.$axios.put(`barrera-acceso/actualizar/${this.barreraSelecionada.id}`, data)
                .then((res) => {
                    this.$toast.success("La barrera de acceso se actualizo con exito");
                })
                .catch((error) => {
                    this.$toast.error("Hubo en error al actualizar la barrera de acceso!!")
                })
                .finally(() => {
                    this.setPreload(false);
                });
        },

        cerrarModal() {
            this.$emit("update:mostrarModal", false);
            this.$emit('listar');
        },

        abrirModalSolucionar() {
            this.mostrarModalSolucionar = true;
        },

        abrirModalAsignar() {
            this.mostrarModalAsignar = true;
        },

        abrirModalReasignar() {
            this.mostrarModalReasignar = true;
        },

        abrirModalPresolucionado() {
            this.mostrarModalPresolucionadas = true;
        },

        abrirModalReasignadoPresolucion() {
            this.mostrarModalReasignadoPresolucion = true;
        },

        async consultarAdjunto(ruta) {
            this.setPreload(true);
            try {
                let adj = await this.$adjuntos(ruta);
                let blob = new Blob([adj[1]], {
                    type: adj[0],
                });
                let link = document.createElement("a");
                link.href = window.URL.createObjectURL(blob);
                window.open(link.href, "_blank");
            } catch (error) {
                this.$toast.error("Error al cargar el archivo");
            } finally {
                this.setPreload(false);
            }
        },

    }
}
</script>
