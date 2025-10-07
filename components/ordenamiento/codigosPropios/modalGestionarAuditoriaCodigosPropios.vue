<template>
    <div>
        <v-dialog v-model="mostrarModalGestionarAuditoria" persistent fullscreen scrollable>
            <v-card>
                <v-alert dense text border="left" type="info" icon="mdi-format-list-bulleted-square"
                    class="text-center">
                    <b>Detalles de la Orden N° {{ orden?.id }}</b>
                </v-alert>
                <v-card-text>
                    <editar-afiliado-componente :afiliado="afiliado" v-if="afiliado" :modoDetalle="true"
                        :modoEdicion="true" :mostrarClasificaciones="true" />
                    <v-divider class="mb-2 mt-4"></v-divider>
                    <ver-adjuntos :adjuntos="adjuntos" v-if="adjuntos && adjuntos.length > 0" />
                    <v-divider class="mb-2 mt-4"></v-divider>
                    <v-row dense>
                        <v-col cols="12" sm="12" md="12">
                            <v-alert text dense border="left" type="info" icon="mdi-needle" class="text-center">
                                <v-row dense align="center">
                                    <v-col class="grow">
                                        <b>Servicios</b>
                                    </v-col>
                                    <v-col class="shrink d-flex" style="gap:.5rem">
                                        <v-btn dark small color="blue-grey"
                                            :disabled="codigosPropiosSeleccionados.length === 0"
                                            @click="abrirModalAgregarNota"
                                            v-show="$can('autorizacion.agregarNotaAdicional')">
                                            Agregar Nota Adicional ({{ codigosPropiosSeleccionados.length }})
                                        </v-btn>
                                        <v-btn dark small color="primary"
                                            :disabled="codigosPropiosSeleccionados.length === 0"
                                            @click="abrirModalCambiarDireccionamientoMasivo"
                                            v-show="$can('autorizacion.cambiarDireccionamiento')">
                                            Cambiar Direccionamiento ({{ codigosPropiosSeleccionados.length }})
                                        </v-btn>
                                        <v-btn dark small color="success" @click="abrirModalAgregarCodigosPropios"
                                            v-show="$can('autorizacion.agregarServicios')">
                                            Agregar Nuevos Servicio(s)
                                        </v-btn>
                                    </v-col>
                                </v-row>
                            </v-alert>
                        </v-col>
                        <v-col cols="12" sm="12" md="12">
                            <v-data-table dense :headers="headersCodigosPropios" :items="codigosPropiosPorAuditar"
                                :loading="loading.codigosPropiosPorAuditar" no-data-text="Sin datos para mostrar."
                                loading-text="Cargando... Por favor espere." show-select :single-select="false"
                                item-key="id" v-model="codigosPropiosSeleccionados">
                                <template v-slot:[`item.servicio`]="{ item }">
                                    <v-tooltip bottom>
                                        <template v-slot:activator="{ on, attrs }">
                                            <div v-bind="attrs" v-on="on" style="display: inline-block;">
                                                <v-btn text small @click="abrirModalEditarCodigoPropio(item)"
                                                    :disabled="false" :class="{ 'v-btn--disabled': !item.esEditable }">
                                                    {{ item?.codigo_propio?.nombre }}
                                                </v-btn>
                                            </div>
                                        </template>
                                        <span>
                                            {{
                                                item.esEditable ? 'Cambiar Servicio' : 'Este Servicio no se puede cambiar'
                                            }}
                                        </span>
                                    </v-tooltip>
                                </template>
                                <template v-slot:[`item.nombrePrestador`]="{ item }">
                                    <v-btn :disabled="!$can('autorizacion.cambiarDireccionamiento')" text small
                                        @click="abrirModalCambiarDireccionamientoIndividual(item)">
                                        {{ item?.rep?.nombre ?? 'Sin Direccionamiento' }}
                                    </v-btn>
                                </template>
                                <template v-slot:[`item.telefonoPrestador`]="{ item }">
                                    <td class="text-center">{{ item?.rep?.telefono1 ?? '-' }}</td>
                                </template>
                                <template v-slot:[`item.direccionPrestador`]="{ item }">
                                    <td class="text-center">{{ item?.rep?.direccion ?? '-' }}</td>
                                </template>
                                <template v-slot:[`item.acciones`]="{ item }">
                                    <v-tooltip bottom>
                                        <template v-slot:activator="{ on, attrs }">
                                            <v-icon v-bind="attrs" v-on="on" color="primary"
                                                @click="abrirModalVerNotas(item)">
                                                mdi-comment-eye-outline
                                            </v-icon>
                                        </template>
                                        <span>Histórico de Notas</span>
                                    </v-tooltip>
                                </template>
                            </v-data-table>
                        </v-col>
                    </v-row>
                    <v-form ref="formAuditarServicios"
                        v-if="codigosPropiosPorAuditar && codigosPropiosPorAuditar.length > 0">
                        <v-row dense>
                            <v-col cols="12" sm="12" md="12">
                                <v-divider />
                            </v-col>
                            <v-col cols="12" sm="12" md="12">
                                <v-alert dense text color="primary" icon="mdi-clipboard-check-multiple-outline"
                                    class="text-center">
                                    <b>Proceso de Auditoría</b>
                                </v-alert>
                            </v-col>
                            <v-col cols="12" sm="12" md="12">
                                <v-select dense outlined label="Acción *" v-model="formAuditoria.estado"
                                    :items="opcionesAcciones" item-text="text" item-value="value"
                                    :rules="[rules.obligatorio]" />
                            </v-col>
                            <v-col cols="12" sm="12" :md="formAuditoria.posFechar ? 6 : 12"
                                v-if="formAuditoria.estado && formAuditoria.estado === 4">
                                <v-select dense outlined label="Pos-Fechar ?" :items="opcionesPosFechar"
                                    item-text="text" item-value="value" :rules="[rules.obligatorio]"
                                    v-model="formAuditoria.posFechar" />
                            </v-col>
                            <v-col cols="12" sm="12" :md="formAuditoria.posFechar ? 6 : 12"
                                v-if="formAuditoria.estado && formAuditoria.estado === 4 && formAuditoria.posFechar">
                                <v-menu dense v-model="menu.fechaVigencia" :close-on-content-click="false"
                                    :nudge-right="40" transition="scale-transition" offset-y min-width="auto">
                                    <template v-slot:activator="{ on, attrs }">
                                        <v-text-field dense outlined label="Nueva Fecha Vigencia *"
                                            append-icon="mdi-calendar" v-bind="attrs" v-on="on"
                                            v-model="formAuditoria.fechaVigencia" readonly
                                            :rules="[rules.obligatorio]"></v-text-field>
                                    </template>
                                    <v-date-picker
                                        :min="fechaMinimaVigencia ? fechaMinimaVigencia.toISOString().split('T')[0] : null"
                                        v-model="formAuditoria.fechaVigencia"
                                        @input="menu.fechaVigencia = false"></v-date-picker>
                                </v-menu>
                            </v-col>
                            <v-col cols="12" sm="12" md="12">
                                <v-textarea dense outlined auto-grow v-model="formAuditoria.observacion"
                                    label="Observaciones" :rules="[rules.minCaracteres, rules.obligatorio]" />
                            </v-col>
                        </v-row>
                    </v-form>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="error" dark small @click="cerrarModal">Salir</v-btn>
                    <v-btn color="success" dark small @click="guardarAuditoria"
                        :disabled="codigosPropiosSeleccionados.length === 0">Guardar Auditoria
                        ({{ codigosPropiosSeleccionados.length }})
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <!-- Cambio Direccionamiento Masivo  -->
        <modal-cambiar-direccionamiento-masivo-codigos-propios
            :mostrar-modal-cambio-direccionamiento.sync="mostrarModalCambioDireccionamientoMasivo"
            :orden-codigos-propios="codigosPropiosSeleccionados" @recargarDatos="listarCodigosPropiosPorAuditar" />

        <!-- Cambio Direccionamiento Individual -->
        <modal-cambiar-direccionamiento-individual-codigos-propios :orden-codigo-propio="ordenIndividualSeleccionada"
            :mostrar-modal-cambiar-direccionamiento.sync="mostrarModalCambiarDireccionamientoIndividual"
            @recargarDatos="listarCodigosPropiosPorAuditar" />

        <!-- Agregar Notas Adicionales -->
        <modal-agregar-nota-adicional-masivo-codigos-propios :mostrar-modal-agregar-nota.sync="mostrarModalAgregarNota"
            :orden-codigos-propios="codigosPropiosSeleccionados" />

        <!-- Ver Notas -->
        <modal-ver-notas-auditoria-codigos-propios :mostrar-modal-ver-notas.sync="mostrarModalVerNotas"
            :orden-codigo-propio="ordenIndividualSeleccionada" />

        <!-- Agregar Nuevos Códigos Propios -->
        <modal-agregar-nuevos-codigos-propios
            :mostrar-modal-agregar-codigos-propios.sync="mostrarModalAgregarCodigosPropios" :orden-id="orden?.id"
            :fecha-minima-vigencia="fechaMinimaVigencia" @recargarDatos="listarCodigosPropiosPorAuditar" />

        <!-- Enviar Correo Electrónico -->
        <modal-envio-correo-orden :mostrar-modal-envio-correo.sync="mostrarModalEnvioCorreo"
            :items="codigosPropiosSeleccionados" :tipo-orden="'codigoPropio'" @cerrarModalPadre="cerrarModal" />

        <!-- Cambiar Código Propio -->
        <modal-editar-codigo-propio-orden :mostrar-modal-editar-codigo-propio.sync="mostrarModalEditarCodigoPropio"
            :orden-codigo-propio="ordenIndividualSeleccionada" @recargarDatos="listarCodigosPropiosPorAuditar" />

    </div>
</template>

<script>
import { mapActions } from "vuex";
import EditarAfiliadoComponente from "~/components/afiliado/FormularioAfiliadoComponente.vue";
import VerAdjuntos from "~/components/consultas/verAdjuntos.vue";
import ModalAgregarNuevosCodigosPropios
    from "~/components/ordenamiento/codigosPropios/modalAgregarNuevosCodigosPropios.vue";
import ModalCambiarDireccionamientoIndividualCodigosPropios
    from "~/components/ordenamiento/codigosPropios/modalCambiarDireccionamientoIndividualCodigosPropios.vue";
import ModalCambiarDireccionamientoMasivoCodigosPropios
    from "~/components/ordenamiento/codigosPropios/modalCambiarDireccionamientoMasivoCodigosPropios.vue";
import ModalAgregarNotaAdicionalMasivoCodigosPropios
    from "~/components/ordenamiento/codigosPropios/modalAgregarNotaAdicionalMasivoCodigosPropios.vue";
import ModalVerNotasAuditoriaCodigosPropios
    from "~/components/ordenamiento/codigosPropios/modalVerNotasAuditoriaCodigosPropios.vue";
import ModalEnvioCorreoOrden from "~/components/ordenamiento/modalEnvioCorreoOrden.vue";
import ModalEditarCodigoPropioOrden from "~/components/ordenamiento/codigosPropios/modalEditarCodigoPropioOrden.vue";

export default {
    components: {
        ModalEditarCodigoPropioOrden,
        ModalEnvioCorreoOrden,
        ModalVerNotasAuditoriaCodigosPropios,
        ModalAgregarNotaAdicionalMasivoCodigosPropios,
        ModalCambiarDireccionamientoMasivoCodigosPropios,
        ModalCambiarDireccionamientoIndividualCodigosPropios,
        ModalAgregarNuevosCodigosPropios,
        VerAdjuntos,
        EditarAfiliadoComponente
    },
    props: {
        mostrarModalGestionarAuditoria: {
            type: Boolean,
            default: false
        },
        orden: {
            type: Object,
            default: () => ({})
        }
    },
    data() {
        return {
            afiliado: null,
            adjuntos: [],
            loading: {
                codigosPropiosPorAuditar: false
            },
            codigosPropiosPorAuditar: [],
            headersCodigosPropios: [
                { text: 'Consecutivo', value: 'id', align: 'center' },
                { text: 'Código', value: 'codigo_propio.codigo', align: 'center' },
                { text: 'Servicio', value: 'servicio', align: 'center' },
                { text: 'Cantidad', value: 'cantidad', align: 'center' },
                { text: 'Fecha de Vigencia', value: 'fecha_vigencia', align: 'center' },
                { text: 'Observación', value: 'observacion', align: 'center' },
                { text: 'Prestador', value: 'nombrePrestador', align: 'center' },
                { text: 'Teléfono Prestador', value: 'telefonoPrestador', align: 'center' },
                { text: 'Dirección Prestador', value: 'direccionPrestador', align: 'center' },
                { text: 'Acciones', value: 'acciones', align: 'center' },
            ],
            codigosPropiosSeleccionados: [],
            mostrarModalCambioDireccionamientoMasivo: false,
            opcionesAcciones: [
                { text: 'Autorizar', value: 4 },
                { text: 'Inadecuar', value: 20 },
                { text: 'Negar', value: 21 },
                { text: 'Anular', value: 5 },
            ],
            rules: {
                obligatorio: (value) => value !== null && value !== undefined || "Este campo es obligatorio.",
                minCaracteres: value => value.length >= 10 || 'Este campo debe tener al menos 10 caracteres.',
            },
            formAuditoria: {
                estado: null,
                observacion: '',
                posFechar: false,
                fechaVigencia: null,
            },
            menu: {
                fechaVigencia: false
            },
            opcionesPosFechar: [
                { text: "SI", value: true },
                { text: "NO", value: false },
            ],
            mostrarModalAgregarNota: false,
            ordenIndividualSeleccionada: {},
            mostrarModalVerNotas: false,
            mostrarModalCambiarDireccionamientoIndividual: false,
            fechaMinimaVigencia: null,
            mostrarModalAgregarCodigosPropios: false,
            mostrarModalEnvioCorreo: false,
            mostrarModalEditarCodigoPropio: false,
        }
    },
    watch: {
        mostrarModalGestionarAuditoria(newValue) {
            if (newValue) {
                this.buscarAfiliado();
                this.obtenerAdjuntos();
                this.listarCodigosPropiosPorAuditar();
            }
        }
    },
    methods: {
        ...mapActions('app', ['setPreload']),

        cerrarModal() {
            this.afiliado = null;
            this.adjuntos = [];
            this.codigosPropiosPorAuditar = [];
            this.codigosPropiosSeleccionados = [];
            this.limpiarFormulario();
            this.$emit('update:mostrarModalGestionarAuditoria', false);
        },

        async buscarAfiliado() {

            const afiliadoId = this.orden?.consulta?.afiliado_id;
            try {
                this.setPreload(true);

                const response = await this.$axios.post(`/afiliados/listar-afiliado-por-id/${afiliadoId}`);

                this.afiliado = response.data;

            } catch (error) {
                this.$toast.error('Ocurrió un error al listar los datos del afiliado.');
            } finally {
                this.setPreload(false);
            }
        },

        async obtenerAdjuntos() {
            try {
                this.setPreload(true);

                const response = await this.$axios.post('/transcripciones/buscarAdjuntos', {
                    afiliado_id: this.orden?.consulta?.afiliado_id,
                    consulta_id: this.orden?.consulta?.id
                });

                this.adjuntos = response.data;

            } catch
            (error) {
                this.$toast.error('Ocurrio un error al listar los adjuntos');
            } finally {
                this.setPreload(false);
            }
        },

        async listarCodigosPropiosPorAuditar() {
            try {
                const afiliadoId = this.orden?.consulta?.afiliado_id;
                this.codigosPropiosSeleccionados = [];

                this.loading.codigosPropiosPorAuditar = true;

                const response = await this.$axios.get(`/ordenamiento/listar-codigos-propios-por-auditar/${afiliadoId}/${this.orden?.id}`);

                this.codigosPropiosPorAuditar = response.data;

                // Encontrar la fecha más antigua en `fecha_vigencia` para limitar el posfechado
                if (this.codigosPropiosPorAuditar.length > 0) {
                    this.fechaMinimaVigencia = this.codigosPropiosPorAuditar
                        .map(item => new Date(item.fecha_vigencia))
                        .reduce((min, fecha) => fecha < min ? fecha : min, new Date());
                }

            } catch (error) {
                this.$toast.error('Ocurrió un error al listar los códigos propios.');
            } finally {
                this.loading.codigosPropiosPorAuditar = false;
            }
        },

        abrirModalCambiarDireccionamientoMasivo() {
            this.mostrarModalCambioDireccionamientoMasivo = true;
        },

        abrirModalCambiarDireccionamientoIndividual(item) {
            this.ordenIndividualSeleccionada = item;
            this.mostrarModalCambiarDireccionamientoIndividual = true;
        },

        abrirModalAgregarNota() {
            this.mostrarModalAgregarNota = true;
        },

        abrirModalVerNotas(item) {
            this.ordenIndividualSeleccionada = item;
            this.mostrarModalVerNotas = true;
        },

        abrirModalAgregarCodigosPropios() {
            this.mostrarModalAgregarCodigosPropios = true
        },

        limpiarFormulario() {
            this.formAuditoria = {
                estado: null,
                observacion: '',
                posFechar: false,
                fechaVigencia: null,
            };
            if (this.$refs.formAuditarServicios) {
                this.$refs.formAuditarServicios.resetValidation();
            }
        },

        async guardarAuditoria() {
            if (!this.$refs.formAuditarServicios.validate()) return;

            // Validar si alguno de los servicios no tiene direccionamiento
            const servicioSinRep = this.codigosPropiosSeleccionados.filter(item => !item.rep_id);

            if (this.formAuditoria.estado === 4 && servicioSinRep.length > 0) {
                // Construimos la lista en formato HTML para SweetAlert
                const listaHtml = servicioSinRep
                    .map(item => `<li><strong>(${item.codigo_propio?.codigo})</strong> ${item.codigo_propio?.nombre}</li>`)
                    .join('');

                this.$swal({
                    title: 'Servicios sin direccionamiento',
                    html: `
      <p>No es posible guardar la auditoría debido a que algunos servicios no tienen direccionamiento.</p>
      <ul style="text-align:left; padding-left: 20px;">${listaHtml}</ul>
    `,
                    type: 'error',
                    confirmButtonText: 'Entendido'
                });

                return;
            }


            const data = {
                estado: this.formAuditoria.estado,
                observacion: this.formAuditoria.observacion,
                orden_codigos_propios: this.codigosPropiosSeleccionados.map(item => item.id),
                pos_fechar: this.formAuditoria.posFechar,
                fecha_vigencia: this.formAuditoria.posFechar ? this.formAuditoria.fechaVigencia : null
            }

            try {
                this.setPreload(true);

                await this.$axios.post('/auditoria/gestionar-auditoria-codigos-propios', data);

                this.$toast.success('Auditoría guardada con éxito.');

                if (parseInt(this.formAuditoria.estado) === 4) {
                    await this.abrirModalEnvioCorreo();
                } else {
                    this.cerrarModal();
                }

                this.$emit('recargarDatos');

            } catch (error) {
                this.$toast.error('Ocurrió un erro al guardar la auditoría');
            } finally {
                this.setPreload(false);
            }
        },

        abrirModalEnvioCorreo() {
            this.mostrarModalEnvioCorreo = true;
        },

        abrirModalEditarCodigoPropio(item) {
            this.ordenIndividualSeleccionada = item;
            this.mostrarModalEditarCodigoPropio = true
        }
    }
}
</script>
