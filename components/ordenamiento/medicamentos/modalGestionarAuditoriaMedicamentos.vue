<template>
    <div>
        <v-dialog v-model="mostrarModalGestionarAuditoria" persistent fullscreen scrollable>
            <v-card>
                <v-alert dense text border="left" color="primary" icon="mdi-format-list-bulleted-square"
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
                            <v-alert text dense border="left" color="primary" icon="mdi-pill-multiple"
                                class="text-center">
                                <v-row dense align="center">
                                    <v-col class="grow">
                                        <b>Artículos</b>
                                    </v-col>
                                    <v-col class="shrink d-flex">
                                        <v-btn dark small color="primary"
                                            :disabled="articulosSeleccionados.length === 0"
                                            @click="abrirModalCambiarDireccionamiento"
                                            v-show="$can('autorizacion.cambiarDireccionamiento')">
                                            Cambiar Direccionamiento ({{ articulosSeleccionados.length }})
                                        </v-btn>
                                    </v-col>
                                </v-row>
                            </v-alert>
                        </v-col>
                        <v-col cols="12" sm="12" md="12">
                            <v-data-table dense :headers="headersArticulos" :items="articulosPorAuditar"
                                :loading="loading.articulosPorAuditar" no-data-text="Sin datos para mostrar."
                                loading-text="Cargando... Por favor espere." show-select :single-select="false"
                                item-key="id" v-model="articulosSeleccionados">
                                <template v-slot:[`item.direccionamiento`]="{ item }">
                                    <td class="text-center">{{ item?.rep?.nombre ?? 'Sin Direccionamiento' }}</td>
                                </template>
                                <template v-slot:[`item.unidadMedida`]="{ item }">
                                    <td class="text-center">
                                        {{ item?.codesumi?.unidad_medida ?? 'Sin Parametrización' }}
                                    </td>
                                </template>
                            </v-data-table>
                        </v-col>
                    </v-row>
                    <v-form ref="formAuditarArticulos" v-if="articulosPorAuditar && articulosPorAuditar.length > 0">
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
                            <v-col cols="12" sm="12" md="12">
                                <v-textarea dense outlined auto-grow v-model="formAuditoria.observacion"
                                    label="Observaciones" :rules="[rules.minCaracteres, rules.obligatorio]" />
                            </v-col>
                            <template v-if="formAuditoria.estado === 21">
                                <v-col cols="12" sm="12" md="6">
                                    <v-textarea dense outlined auto-grow label="Fundamento Legal"
                                        v-model="formAuditoria.fundamento_legal"
                                        hint="Relacione las disposiciones que presuntamente respaldan la decisión."
                                        persistent-hint :rules="[rules.minCaracteres, rules.obligatorio]" />
                                </v-col>
                                <v-col cols="12" sm="12" md="6">
                                    <v-textarea dense outlined auto-grow label="Alternativas"
                                        v-model="formAuditoria.alternativas_acceso_salud"
                                        hint="Alternativas para que el usuario acceda al Servicio de Salud o Medicamento solicitado y haga valer sus Derechos Legales y Constitucionales."
                                        persistent-hint :rules="[rules.minCaracteres]" />
                                </v-col>
                                <v-col cols="12" sm="12" md="12">
                                    <v-alert dense text color="primary" icon="mdi-badge-account-horizontal-outline"
                                        class="text-center">
                                        <b>Tipo de Plan del Usuario</b>
                                    </v-alert>
                                </v-col>
                                <v-container>
                                    <v-row dense>
                                        <v-col v-for="(plan, index) in opcionesTipoPlanUsuario" :key="index" cols="12"
                                            sm="6" md="4">
                                            <v-checkbox v-model="formAuditoria.tipo_plan_usuario" dense :label="plan"
                                                :value="plan" :rules="[rules.minSeleccionados]" />
                                        </v-col>
                                    </v-row>
                                </v-container>
                            </template>
                        </v-row>
                    </v-form>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="error" dark small @click="cerrarModal">Salir</v-btn>
                    <v-btn color="success" dark small @click="guardarAuditoria"
                        :disabled="articulosSeleccionados.length === 0">Guardar
                        Auditoria
                        ({{ articulosSeleccionados.length }})
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <!-- Cambio de Direccionamiento -->
        <modal-cambiar-direccionamiento-masivo-medicamentos
            :mostrar-modal-cambio-direccionamiento.sync="mostrarModalCambioDireccionamiento"
            :orden-articulos="articulosSeleccionados" @recargarDatos="listarArticulosPorAuditar" />
    </div>
</template>
<script>
import { mapActions } from "vuex";
import EditarAfiliadoComponente from "~/components/afiliado/FormularioAfiliadoComponente.vue";
import VerAdjuntos from "~/components/consultas/verAdjuntos.vue";
import ModalCambiarDireccionamientoMasivoMedicamentos
    from '~/components/ordenamiento/medicamentos/modalCambiarDireccionamientoMasivoMedicamentos.vue'

export default {
    components: {
        ModalCambiarDireccionamientoMasivoMedicamentos,
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
                articulosPorAuditar: false
            },
            articulosPorAuditar: [],
            headersArticulos: [
                { text: 'Consecutivo', value: 'id', align: 'center' },
                { text: 'Código', value: 'codesumi.codigo', align: 'center' },
                { text: 'Artículo', value: 'codesumi.nombre', align: 'center' },
                { text: 'Dosificación', value: 'dosificacion', align: 'center' },
                { text: 'Direccionamiento', value: 'direccionamiento', align: 'center' },
                { text: 'Vía de Administración', value: 'codesumi.via', align: 'center' },
                { text: 'Unidad de Medida', value: 'unidadMedida', align: 'center' },
                { text: 'Frecuencia', value: 'frecuencia', align: 'center' },
                { text: 'Unidad de Tiempo', value: 'unidad_tiempo', align: 'center' },
                { text: 'Duración', value: 'duracion', align: 'center' },
                { text: 'Número de Meses', value: 'meses', align: 'center' },
                { text: 'Observación', value: 'observacion', align: 'center' },
                { text: 'Cantidad Médico', value: 'cantidad_medico', align: 'center' },
            ],
            articulosSeleccionados: [],
            mostrarModalCambioDireccionamiento: false,
            opcionesAcciones: [
                { text: 'Autorizar', value: 4 },
                { text: 'Inadecuar', value: 20 },
                { text: 'Negar', value: 21 },
                { text: 'Anular', value: 5 },
            ],
            rules: {
                obligatorio: (value) => !!value || "Este campo es obligatorio.",
                minCaracteres: (value) => !value || value.length >= 10 || "Este campo debe tener al menos 10 caracteres.",
                minSeleccionados: (value) => (value && value.length > 0) || "Debe seleccionar al menos un tipo de plan.",
            },
            formAuditoria: {
                estado: null,
                observacion: '',
                fundamento_legal: '',
                alternativas_acceso_salud: '',
                tipo_plan_usuario: [],
            },
            opcionesTipoPlanUsuario: [
                'POS',
                'POS-S',
                'PLAN COMPLEMENTARIO (PAC)',
                'POBLACIÓN POBRE NO CUBIERTA CON SUBSIDIO A LA DEMANDA',
                'REMITIR SIN ASEGURAMIENTO',
                'NRO. DE SEMANAS COTIZADAS POR EL USUARIO AL SGSSS',
                'ESTADO DE LA AFILIACIÓN/CONTRATO DEL USUARIO',
                'VIGENTE',
                'SUSPENDIDO',
            ]
        }
    },
    watch: {
        mostrarModalGestionarAuditoria(newValue) {
            if (newValue) {
                this.buscarAfiliado();
                this.obtenerAdjuntos();
                this.listarArticulosPorAuditar();
            }
        }
    },
    methods: {
        ...mapActions('app', ['setPreload']),

        cerrarModal() {
            this.afiliado = null;
            this.adjuntos = [];
            this.articulosPorAuditar = [];
            this.articulosSeleccionados = [];
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

        async listarArticulosPorAuditar() {
            try {
                this.loading.articulosPorAuditar = true;

                const response = await this.$axios.get(`/ordenamiento/listar-articulos-por-auditar/${this.orden?.id}`);

                this.articulosPorAuditar = response.data;

            } catch (error) {
                this.$toast.error('Ocurrió un error al listar los artículos.');
            } finally {
                this.loading.articulosPorAuditar = false;
            }
        },

        abrirModalCambiarDireccionamiento() {
            this.mostrarModalCambioDireccionamiento = true
        },

        limpiarFormulario() {
            this.formAuditoria = {
                estado: null,
                observacion: '',
                fundamento_legal: '',
                alternativas_acceso_salud: '',
                tipo_plan_usuario: [],
            };
            if (this.$refs.formAuditarArticulos) {
                this.$refs.formAuditarArticulos.resetValidation();
            }
        },

        async guardarAuditoria() {
            if (!this.$refs.formAuditarArticulos.validate()) return;

            // Validar si alguno de los servicios no tiene direccionamiento
            const medicamentoSinRep = this.articulosSeleccionados.filter(item => !item.rep_id);

            if (this.formAuditoria.estado === 4 && medicamentoSinRep.length > 0) {
                // Construimos la lista en formato HTML para SweetAlert
                const listaHtml = medicamentoSinRep
                    .map(item => `<li><strong>(${item.codesumi?.codigo})</strong> ${item.codesumi?.nombre}</li>`)
                    .join('');

                this.$swal({
                    title: 'Artículos sin direccionamiento',
                    html: `
      <p>No es posible guardar la auditoría debido a que algunos artículos no tienen direccionamiento.</p>
      <ul style="text-align:left; padding-left: 20px;">${listaHtml}</ul>
    `,
                    type: 'error',
                    confirmButtonText: 'Entendido'
                });

                return;
            }

            const tipoPlanFormateado = Array.isArray(this.formAuditoria.tipo_plan_usuario)
                ? this.formAuditoria.tipo_plan_usuario.join(', ')
                : '';

            const data = {
                estado: this.formAuditoria.estado,
                observacion: this.formAuditoria.observacion,
                orden_articulos: this.articulosSeleccionados.map(item => item.id),
                negar: this.formAuditoria.estado === 21 ? 1 : 0,
                fundamento_legal: this.formAuditoria.estado === 21 ? this.formAuditoria.fundamento_legal : null,
                alternativas_acceso_salud: this.formAuditoria.estado === 21 ? this.formAuditoria.alternativas_acceso_salud : null,
                tipo_plan_usuario: this.formAuditoria.estado === 21 ? tipoPlanFormateado : null
            };

            try {

                this.setPreload(true);

                await this.$axios.post('/auditoria/gestionar-auditoria-medicamentos', data);

                this.$toast.success('Auditoría guardada con éxito.');

                if (this.formAuditoria.estado === 21) {
                    await this.imprimirFormatoNegacion()
                }

                this.cerrarModal();

                this.$emit('recargarDatos');

            } catch (error) {
                this.$toast.error('Ocurrió un error al guardar la auditoría.');
            } finally {
                this.setPreload(false);
            }
        },

        async imprimirFormatoNegacion() {
            const data = {
                orden_articulo: this.articulosSeleccionados,
                tipo: 'formatoNegacion',
                tipoOrden: 'Medicamento'
            }

            try {
                this.setPreload(true);
                const response = await this.$axios.post('/pdf', data, {
                    responseType: 'arraybuffer'
                });

                let blob = new Blob([response.data], {
                    type: "application/pdf"
                });
                let link = document.createElement("a");
                link.href = window.URL.createObjectURL(blob);
                window.open(link.href, "_blank");
            } catch (error) {
                this.$toast.error('Ocurrió un error al imprimir la el formato de negación.');
            } finally {
                this.setPreload(false);
            }
        }
    }
}
</script>
