<template>
    <div>
        <historico-ordenamiento-articulos-internos :afiliado="afiliado" @reformular-articulo="manejarReformulacion"
            ref="historicoOrdenamiento" />
        <v-form ref="formOrdenamiento">
            <v-row dense>
                <v-col cols="12" sm="12" md="12" class="my-2">
                    <v-divider />
                </v-col>
                <v-col cols="12" sm="12" md="12">
                    <v-autocomplete dense outlined label="Artículo *" v-model="formAgregarMedicamento.articulo"
                        :loading="loading.opcionesArticulos" :items="opcionesArticulos" item-text="codesumi.nombre"
                        return-object hint="Escriba el nombre del artículo para iniciar la búsqueda."
                        no-data-text="Escriba el nombre del artículo para iniciar la búsqueda."
                        :rules="[rules.obligatorio]" :search-input.sync="camposBusqueda.articulo"
                        @change="listarViasAdministracionCodesumi()" />
                </v-col>
                <v-col cols="12" sm="6" md="6">
                    <v-text-field dense outlined readonly label="Forma Farmaceutica"
                        :value="formAgregarMedicamento?.articulo?.codesumi?.forma_farmaceutica?.nombre.toUpperCase() ?? ' - '"
                        :disabled="formularioDeshabilitado" />
                </v-col>
                <v-col cols="12" sm="6" md="6">
                    <v-autocomplete dense outlined label="Via de administración *" :items="opcionesViasAdministracion"
                        :disabled="formularioDeshabilitado" :loading="loading.opcionesViasAdministracion"
                        :rules="[rules.obligatorio]" item-text="nombre" return-object
                        v-model="formAgregarMedicamento.via_administracion" />
                </v-col>
                <v-col cols="12" sm="12" md="12">
                    <v-alert dense text color="blue-grey" border="left" icon="mdi-information-box" class="text-center">
                        <b>Información de la dosis</b>
                    </v-alert>
                </v-col>
                <v-col cols="12" sm="12" md="12">
                    <v-select dense outlined label="Finalización *" :disabled="formularioDeshabilitado"
                        :rules="[rules.obligatorio]" :items="opcionesFinalzacion"
                        v-model="formAgregarMedicamento.finalizacion" />
                </v-col>
                <v-col cols="12" sm="6" md="6">
                    <v-text-field dense outlined label="Peso (Kg) *" type="number"
                        v-model="formAgregarMedicamento.peso_afiliado" :rules="[rules.obligatorio]"
                        :disabled="formularioDeshabilitado"></v-text-field>
                </v-col>
                <v-col cols="12" sm="6" md="6">
                    <v-text-field dense outlined label="Talla (Cm) *" type="number"
                        v-model="formAgregarMedicamento.talla_afiliado" :rules="[rules.obligatorio]"
                        :disabled="formularioDeshabilitado"></v-text-field>
                </v-col>
                <v-col cols="12" sm="6" md="6">
                    <v-text-field dense outlined type="number" label="Dosis *" :rules="[rules.obligatorio]"
                        :disabled="formularioDeshabilitado" v-model="formAgregarMedicamento.dosis" min="1" />
                </v-col>
                <v-col cols="12" sm="6" md="6">
                    <v-text-field dense outlined readonly
                        :value="formAgregarMedicamento?.via_administracion?.nombre ?? ' - '" label="Unidad Dosis"
                        :disabled="formularioDeshabilitado" />
                </v-col>
                <v-col cols="12" sm="6" md="6">
                    <v-text-field dense outlined type="number" label="Frecuencia *" :rules="reglasFrecuencia"
                        :disabled="formularioDeshabilitado || camposTemporalesDeshabilitados"
                        v-model="formAgregarMedicamento.frecuencia" min="1" />
                </v-col>
                <v-col cols="12" sm="6" md="6">
                    <v-select dense outlined label="Unidad de Tiempo *" :items="opcionesUnidadTiempo"
                        :rules="reglasUnidadTiempo"
                        :disabled="formularioDeshabilitado || camposTemporalesDeshabilitados"
                        v-model="formAgregarMedicamento.unidad_tiempo" />
                </v-col>
                <v-col cols="12" sm="6" md="6">
                    <v-text-field dense outlined type="number" label="Horas de Vigencia" min="24"
                        :disabled="formularioDeshabilitado" v-model="formAgregarMedicamento.horas_vigencia"
                        :rules=[rules.obligatorio] />
                </v-col>
                <v-col cols="12" sm="6" md="6">
                    <v-text-field dense outlined type="number" label="Cantidad" :rules=[rules.obligatorio]
                        v-model="formAgregarMedicamento.cantidad" :disabled="formularioDeshabilitado" min="1" />
                </v-col>
                <v-col cols="12" sm="12" md="12">
                    <v-textarea dense outlined auto-grow counter label="Indicación Médica *"
                        :rules="[rules.obligatorio, rules.minCaracteres]" :disabled="formularioDeshabilitado"
                        v-model="formAgregarMedicamento.observacion" />
                </v-col>
                <v-col cols="12" sm="6" md="6">
                    <v-btn block dark color="warning" @click="limpiarFormulario()" :loading="formBloqueado">
                        Limpiar
                    </v-btn>
                </v-col>
                <v-col cols="12" sm="6" md="6">
                    <v-btn block dark color="success" @click="agregarArticulo()" :loading="formBloqueado">
                        Agregar
                    </v-btn>
                </v-col>
            </v-row>
        </v-form>
        <v-row dense>
            <v-col cols="12" sm="12" md="12" class="mt-2">
                <v-divider />
            </v-col>
            <v-col cols="12" sm="12" md="12">
                <v-alert dense text border="left" class="text-center" color="primary" icon="mdi-playlist-edit">
                    <b>Resumen Pre-Orden</b>
                </v-alert>
            </v-col>
            <v-col cols="12" sm="12" md="12">
                <v-data-table dense :headers="headersArticulosPreOrdenados" loading-text="Cargando... Por favor espere."
                    no-data-text="Sin datos para mostrar." :items="articulosPreOrdenados">
                    <template v-slot:[`item.dosis`]="{ item, index }">
                        <v-edit-dialog :return-value.sync="item.dosis" large persistent save-text="Guardar"
                            cancel-text="Cancelar" @save="recalcularCantidad(index)" @cancel="restaurarDosis(item)"
                            @open="guardarDosis(item)">
                            <v-btn small text>{{ item.dosis }}</v-btn>
                            <template v-slot:input>
                                <v-card flat class="pa-4" style="min-width: 300px; min-height: 150px;">
                                    <v-alert class="text-center" text dense color="primary" border="left"
                                        icon="mdi-pill-multiple">
                                        <b>Modificar Dosis</b>
                                    </v-alert>
                                    <v-card-text>
                                        <v-text-field v-model="item.dosis" type="number" min="1" label="Dosis" dense
                                            hide-details />
                                    </v-card-text>
                                </v-card>
                            </template>
                        </v-edit-dialog>
                    </template>
                    <template v-slot:[`item.via`]="{ item }">
                        {{ item.via_administracion?.nombre.toUpperCase() ?? ' - ' }}
                    </template>
                    <template v-slot:[`item.finalizacion`]="{ item }">
                        <v-chip small dark label :color="item.finalizacion === 'DEFINIDO' ? 'success' : 'primary'">
                            <b> {{ item.finalizacion === 'DEFINIDO' ? 'DEFINIDO' : 'DOSIS ÚNICA' }} </b>
                        </v-chip>
                    </template>
                    <template v-slot:[`item.frecuencia`]="{ item, index }">
                        <div v-if="item.finalizacion === 'DEFINIDO'">
                            <v-edit-dialog :return-value.sync="item.frecuencia" large persistent save-text="Guardar"
                                cancel-text="Cancelar" @save="recalcularCantidad(index)"
                                @cancel="restaurarFrecuenciaUnidadTiempo(item)"
                                @open="guardarFrecuenciaUnidadTiempo(item)">
                                <v-btn small text>{{ item.frecuencia }} {{ item.unidad_tiempo }}</v-btn>
                                <template v-slot:input>
                                    <v-card flat class="pa-4" style="min-width: 300px; min-height: 150px;">
                                        <v-alert class="text-center" text dense color="primary" border="left"
                                            icon="mdi-clock-time-five-outline">
                                            <b>Modificar Frecuencia</b>
                                        </v-alert>
                                        <v-card-text>
                                            <v-row dense>
                                                <v-col cols="6">
                                                    <v-text-field v-model="item.frecuencia" type="number" min="1"
                                                        step="1" label="Frecuencia" dense hide-details />
                                                </v-col>
                                                <v-col cols="6">
                                                    <v-select v-model="item.unidad_tiempo" :items="opcionesUnidadTiempo"
                                                        label="Unidad de Tiempo" dense hide-details />
                                                </v-col>
                                            </v-row>
                                        </v-card-text>
                                    </v-card>
                                </template>
                            </v-edit-dialog>
                        </div>
                        <div v-else>-</div>
                    </template>
                    <template v-slot:[`item.horas_vigencia`]="{ item, index }">
                        <v-edit-dialog :return-value.sync="item.horas_vigencia" large persistent save-text="Guardar"
                            cancel-text="Cancelar" @save="recalcularCantidad(index)"
                            @cancel="restaurarHorasVigencia(item)" @open="guardarHorasVigencia(item)">
                            <v-btn small text>{{ item.horas_vigencia }} HORAS</v-btn>
                            <template v-slot:input>
                                <v-card flat class="pa-4" style="min-width: 300px; min-height: 150px;">
                                    <v-alert class="text-center" text dense color="primary" border="left"
                                        icon="mdi-hours-24">
                                        <b>Modificar Horas de Vigencia</b>
                                    </v-alert>
                                    <v-card-text>
                                        <v-text-field v-model="item.horas_vigencia" type="number" min="24"
                                            label="Horas de Vigencia" dense hide-details />
                                    </v-card-text>
                                </v-card>
                            </template>
                        </v-edit-dialog>
                    </template>
                    <template v-slot:[`item.cantidad`]="{ item }">
                        <v-edit-dialog :return-value.sync="item.cantidad" large persistent save-text="Guardar"
                            cancel-text="Cancelar" @open="guardarCantidad(item)" @cancel="restaurarCantidad(item)">
                            <v-btn small text>{{ item.cantidad }}</v-btn>
                            <template v-slot:input>
                                <v-card flat class="pa-4" style="min-width: 300px; min-height: 150px;">
                                    <v-alert class="text-center" text dense color="primary" border="left"
                                        icon="mdi-counter">
                                        <b>Modificar Cantidad</b>
                                    </v-alert>
                                    <v-card-text>
                                        <v-text-field v-model="item.cantidad" type="number" min="1" label="Cantidad"
                                            dense hide-details />
                                    </v-card-text>
                                </v-card>
                            </template>
                        </v-edit-dialog>
                    </template>
                    <template v-slot:[`item.acciones`]="{ index }">
                        <v-tooltip bottom>
                            <template v-slot:activator="{ attrs, on }">
                                <v-icon color="error" v-bind="attrs" v-on="on"
                                    @click="eliminarArticuloPreOrdenado(index)">
                                    mdi-close-circle-outline
                                </v-icon>
                            </template>
                            <span>Eliminar</span>
                        </v-tooltip>
                    </template>
                </v-data-table>
            </v-col>
            <v-col cols="12" sm="12" md="12">
                <v-btn block dark color="primary" @click="ordenarArticulos" :loading="formBloqueado"
                    :disabled="articulosPreOrdenados.length === 0">
                    Ordenar
                </v-btn>
            </v-col>
        </v-row>
        <ordenes-articulos-internos-consulta :consulta-id="consulta" ref="ordenArticulosInternosConsulta" />
    </div>
</template>
<script>
import { mapActions } from 'vuex';
import OrdenesArticulosInternosConsulta from '@/components/ordenamiento/articulosInternos/ordenesArticulosInternosConsulta.vue'
import HistoricoOrdenamientoArticulosInternos from '@/components/ordenamiento/articulosInternos/historicoOrdenamientoArticulosInternos.vue'

export default {
    props: {
        afiliado: {
            type: Object,
            required: true,
        },
        consulta: {
            type: Number,
            required: true,
        },
    },
    components: {
        OrdenesArticulosInternosConsulta,
        HistoricoOrdenamientoArticulosInternos
    },
    data() {
        return {
            datosHistoriaUrgencias: null,
            valoresPersistentes: {
                peso_afiliado: null,
                talla_afiliado: null
            },
            formAgregarMedicamento: {
                articulo: null,
                via_administracion: null,
                finalizacion: null,
                peso_afiliado: null,
                talla_afiliado: null,
                dosis: null,
                frecuencia: null,
                unidad_tiempo: null,
                horas_vigencia: 24,
                cantidad: null,
                observacion: ''
            },
            opcionesArticulos: [],
            opcionesViasAdministracion: [],
            rules: {
                obligatorio: v => !!v || 'Este campo es obligatorio.',
                minCaracteres: v => v.length >= 10 || 'Este campo debe tener al menos 10 caractéres.',
                obligatorioSiDefinido: campo => v => {
                    if (this.formAgregarMedicamento.finalizacion === 'DEFINIDO') {
                        return !!v || `El campo ${campo} es obligatorio si la finalización es DEFINIDO.`;
                    }
                    return true;
                }

            },
            loading: {
                opcionesArticulos: false,
                opcionesViasAdministracion: false
            },
            camposBusqueda: {
                articulo: null
            },
            opcionesFinalzacion: [
                { text: 'DOSIS ÚNICA', value: 'DOSIS_UNICA' },
                { text: 'DEFINIDO', value: 'DEFINIDO' },
            ],
            opcionesUnidadTiempo: [
                'SEGUNDOS',
                'MINUTOS',
                'HORAS',
            ],
            articulosPreOrdenados: [],
            headersArticulosPreOrdenados: [
                { text: 'Articulo', value: 'articulo.codesumi.nombre', align: 'center' },
                { text: 'Vía de Administración', value: 'via', align: 'center' },
                { text: 'Finalización', value: 'finalizacion', align: 'center' },
                { text: 'Dosis', value: 'dosis', align: 'center' },
                { text: 'Frecuencia', value: 'frecuencia', align: 'center' },
                { text: 'Horas Vigencia', value: 'horas_vigencia', align: 'center' },
                { text: 'Cantidad', value: 'cantidad', align: 'center' },
                { text: 'Indicación Médica', value: 'observacion', align: 'center' },
                { text: 'Acciones', value: 'acciones', align: 'center', sortable: 'false' },
            ],
            formBloqueado: false,
        }
    },
    computed: {
        formularioDeshabilitado() {
            return this.formBloqueado || !this.formAgregarMedicamento?.articulo?.codesumi?.forma_farmaceutica?.nombre;
        },
        camposTemporalesDeshabilitados() {
            return this.formAgregarMedicamento.finalizacion === 'DOSIS_UNICA';
        },
        reglasFrecuencia() {
            return [
                v => {
                    if (this.formAgregarMedicamento.finalizacion === 'DEFINIDO') {
                        return !!v || 'La frecuencia es obligatoria para finalización DEFINIDO.';
                    }
                    return true;
                }
            ];
        },
        reglasUnidadTiempo() {
            return [
                v => {
                    if (this.formAgregarMedicamento.finalizacion === 'DEFINIDO') {
                        return !!v || 'La unidad de tiempo es obligatoria para finalización DEFINIDO.';
                    }
                    return true;
                }
            ];
        }
    },
    mounted() {
        this.listarDatosHistoriaUrgencias();
    },
    watch: {
        'camposBusqueda.articulo'(nuevoValor) {
            if (nuevoValor && nuevoValor.length === 4) {
                this.buscarOpcionesArticulos();
            }
        },
        'formAgregarMedicamento.finalizacion'(nuevo) {
            if (nuevo === 'DOSIS_UNICA') {
                this.formAgregarMedicamento.frecuencia = null;
                this.formAgregarMedicamento.unidad_tiempo = null;
                this.formAgregarMedicamento.horas_vigencia = 24;
            }
            this.calcularCantidad();
        },
        'formAgregarMedicamento.dosis': 'calcularCantidad',
        'formAgregarMedicamento.frecuencia': 'calcularCantidad',
        'formAgregarMedicamento.unidad_tiempo': 'calcularCantidad',
        'formAgregarMedicamento.horas_vigencia': 'calcularCantidad'
    },
    methods: {
        ...mapActions('app', ['setPreload']),

        async listarDatosHistoriaUrgencias() {
            try {
                this.setPreload(true)

                const { data } = await this.$axios.get(`/historia/registro/${this.consulta}/${this.afiliado.id}`);

                this.datosHistoriaUrgencias = data;

                this.valoresPersistentes.peso_afiliado = data.peso ?? null;
                this.valoresPersistentes.talla_afiliado = data.talla ?? null;

                this.formAgregarMedicamento.peso_afiliado = this.valoresPersistentes.peso_afiliado;
                this.formAgregarMedicamento.talla_afiliado = this.valoresPersistentes.talla_afiliado;

            } catch (error) {
                this.$toast.error('Ocurrio un error al listar los datos de la historia clínica.');
            } finally {
                this.setPreload(false);
            }
        },

        calcularCantidad() {
            const { finalizacion, dosis, frecuencia, unidad_tiempo, horas_vigencia } = this.formAgregarMedicamento;

            if (!dosis || dosis <= 0) {
                this.formAgregarMedicamento.cantidad = null;
                return;
            }

            if (finalizacion === 'DOSIS_UNICA') {
                this.formAgregarMedicamento.cantidad = dosis;
                return;
            }

            if (finalizacion === 'DEFINIDO') {
                if (!frecuencia || !unidad_tiempo || !horas_vigencia) {
                    this.formAgregarMedicamento.cantidad = null;
                    return;
                }

                let frecuenciaHoras;

                switch (unidad_tiempo) {
                    case 'SEGUNDOS':
                        frecuenciaHoras = frecuencia / 3600;
                        break;
                    case 'MINUTOS':
                        frecuenciaHoras = frecuencia / 60;
                        break;
                    case 'HORAS':
                        frecuenciaHoras = frecuencia;
                        break;
                    default:
                        frecuenciaHoras = null;
                }

                if (!frecuenciaHoras || frecuenciaHoras === 0) {
                    this.formAgregarMedicamento.cantidad = null;
                    return;
                }

                const cantidad = Math.ceil((horas_vigencia / frecuenciaHoras) * dosis);

                this.formAgregarMedicamento.cantidad = cantidad;
            } else {
                this.formAgregarMedicamento.cantidad = null;
            }
        },

        limpiarFormulario() {
            this.formAgregarMedicamento = {
                articulo: null,
                via_administracion: null,
                finalizacion: null,
                peso_afiliado: this.valoresPersistentes.peso_afiliado,
                talla_afiliado: this.valoresPersistentes.talla_afiliado,
                dosis: null,
                frecuencia: null,
                unidad_tiempo: null,
                horas_vigencia: 24,
                cantidad: null,
                observacion: ''
            };

            this.camposBusqueda.articulo = null;

            if (this.$refs.formOrdenamiento) {
                this.$refs.formOrdenamiento.resetValidation();
            }
        },


        async agregarArticulo(bypassValidacion = false) {

            if (!bypassValidacion && !this.$refs.formOrdenamiento.validate()) return;

            try {
                this.formBloqueado = true;

                // Validar las alergias del afiliado
                const esAlergico = await this.validarAlergias();
                if (esAlergico) return;


                // Validar las alertas farmacológicas
                const alertas = await this.validarAlertasFarmacologicas();
                if (alertas.resultado) {
                    const continuar = await this.mostrarAlertas(
                        'Alertas Farmacológicas',
                        alertas.mensaje,
                        alertas.alertaDetalleId
                    );

                    if (!continuar) return;
                }

                // Validar si el artículo está contratado
                const esContratado = await this.verificarMedicamentoContratado();
                if (!esContratado) {
                    const confirmar = await this.$swal({
                        title: 'Artículo no contratado',
                        text: `El artículo "${this.formAgregarMedicamento.articulo?.codesumi?.nombre}" no está contratado. ¿Desea agregarlo al ordenamiento?`,
                        type: 'warning',
                        showCancelButton: true,
                        cancelButtonColor: '#d33',
                        confirmButtonText: 'Sí, agregar',
                        cancelButtonText: 'Cancelar',
                    });

                    if (!confirmar.value) return;
                }

                const medicamento = JSON.parse(JSON.stringify(this.formAgregarMedicamento));

                const yaExiste = this.articulosPreOrdenados.some(med =>
                    med.articulo.id === this.formAgregarMedicamento.articulo.id
                );

                if (yaExiste) {
                    this.$toast.warning('Este medicamento ya se encuentra en la preorden.');
                    return;
                }

                this.articulosPreOrdenados.push(medicamento);
                this.$toast.success('Medicamento agregado a la preorden.');
                this.limpiarFormulario();

            } catch (error) {
                this.$toast.error('Ocurrió un error al agregar el artículo.');
            } finally {
                this.formBloqueado = false;

            }
        },

        async verificarMedicamentoContratado() {
            try {
                const { data } = await this.$axios.get(`/codesumis/validar-contratacion-codesumi/${this.afiliado?.id}/${this.formAgregarMedicamento.articulo.codesumi_id}`);

                return data === true;

            } catch (error) {
                this.$toast.error('No se pudo verificar si el medicamento está contratado.');
                return true; // Si falla pasa derecho igualmente.
            }
        },

        async crearAuditoria(acepto, alertaDetalleId) {
            const data = {
                acepto,
                alerta_detalle_id: alertaDetalleId,
                usuario_registra_id: this.$store.state.auth.usuario.id,
                consulta_id: this.consulta,
                estado_alerta_id: 1
            }

            try {
                this.$axios.post('/alertas/crearAuditoria', data);

                this.$toast.success('Auditoria creada exitosamente');
            } catch (error) {
                this.$toast.error('Ocurrió un error al crear la auditoria')
            }
        },


        async mostrarAlertas(titulo, mensaje, alertaDetalleId) {
            try {
                const response = await this.$swal({
                    title: `<div class="custom-swal-title">${titulo}</div>`,
                    html: `<div class="custom-swal-text">${mensaje}</div>`,
                    icon: "info",
                    showCancelButton: true,
                    confirmButtonText: 'Aceptar y continuar',
                    cancelButtonText: 'Cancelar',
                    reverseButtons: true,
                    cancelButtonColor: 'red',
                    confirmButtonColor: 'blue',
                });

                if (response.value) {
                    await this.crearAuditoria('Si', alertaDetalleId);
                    return true;
                } else {
                    await this.crearAuditoria('No', alertaDetalleId);
                    return false;
                }

            } catch (error) {
                this.$toast.error('Ocurrió un error al mostrar la alerta farmacológica.');
                return false;
            }
        },

        async validarAlergias() {
            try {
                await this.$axios.post('/alertas/buscarAlergico', {
                    afiliado_id: this.afiliado.id,
                    codesumi_id: this.formAgregarMedicamento.articulo.codesumi_id
                });

                // No es alérgico
                return false;
            } catch (error) {
                if (error?.response?.status === 400 && error?.response?.data?.error) {
                    await this.$swal({
                        type: 'error',
                        title: '¡El paciente es alérgico a este medicamento!',
                        text: `Observación: ${error.response.data.error}`,
                    });

                    this.limpiarFormulario();
                    return true; // Es alérgico
                } else {
                    this.$toast.error('Ocurrió un error al verificar las alergias del paciente.');
                    return true;
                }
            }
        },

        async validarAlertasFarmacologicas() {
            try {
                const idsArticulosPreOrdenados = [
                    ...this.articulosPreOrdenados.map(item => item.articulo.codesumi.id),
                    this.formAgregarMedicamento.articulo.codesumi.id
                ];

                const { data } = await this.$axios.post('/alertas/verificarInteraccion', {
                    medicamentosSeleccionados: idsArticulosPreOrdenados
                });

                const resultadoAlerta = data[0];

                if (resultadoAlerta.resultado && resultadoAlerta.interacciones.length > 0) {
                    const { interacciones } = resultadoAlerta;

                    let mensajeAlerta = interacciones.map(interaccion =>
                        `Tipo de alerta: ${interaccion.tipo_alerta}\nMensaje: ${interaccion.mensaje}`
                    ).join('\n\n');

                    const alertaDetalleId = interacciones[0].id;

                    return {
                        resultado: true,
                        mensaje: mensajeAlerta,
                        alertaDetalleId
                    }
                }

                return {
                    resultado: false,
                }

            } catch (error) {
                this.$toast.error(`Error al buscar alertas: ${error?.response?.data.message || error}`);
                return {
                    resultado: false
                }
            }
        },

        eliminarArticuloPreOrdenado(index) {
            this.articulosPreOrdenados.splice(index, 1);
            this.$toast.info('Medicamento eliminado de la preorden.');
        },

        async ordenarArticulos() {
            if (this.articulosPreOrdenados.length === 0) {
                this.$toast.error('No hay artículos para ordenar.');
                return;
            }

            this.formBloqueado = true;
            this.setPreload(true);

            try {

                const payload = {
                    consulta_id: this.consulta,
                    afiliado_id: this.afiliado.id,
                    articulos: this.articulosPreOrdenados.map(item => ({
                        articulo_id: item.articulo?.id,
                        codesumi_id: item.articulo?.codesumi_id,
                        via_administracion_id: item.via_administracion?.id,
                        finalizacion: item.finalizacion,
                        dosis: item.dosis,
                        frecuencia: item.frecuencia,
                        unidad_tiempo: item.unidad_tiempo,
                        horas_vigencia: item.horas_vigencia,
                        cantidad: item.cantidad,
                        observacion: item.observacion
                    }))
                }

                await this.$axios.post('/ordenamiento/generar-ordenamiento-intrahospitalario', payload);

                this.$swal({
                    title: "Éxito",
                    text: "Orden generada exitosamente.",
                    type: "success",
                });

                this.limpiarFormulario();
                this.articulosPreOrdenados = [];

                this.$refs.ordenArticulosInternosConsulta.listarArticulosOrdenadosConsulta()
                this.$refs.historicoOrdenamiento.listarHistoricoOrdenamiento();

            } catch (error) {
                this.$toast.error('Ocurrió un error al generar la orden.')
            } finally {
                this.formBloqueado = false;
                this.setPreload(false);
            }
        },

        async buscarOpcionesArticulos() {
            try {
                this.loading.opcionesArticulos = true;

                const { data } = await this.$axios.get(`/medicamentos/buscar-medicamentos-ordenamiento-intrahospitalario/${this.camposBusqueda.articulo}`);

                this.opcionesArticulos = data;

            } catch (error) {
                this.$toast.error('Ocurrio un error al listar los artículos.');
            } finally {
                this.loading.opcionesArticulos = false;
            }
        },

        async listarViasAdministracionCodesumi() {
            try {
                this.loading.opcionesViasAdministracion = true;

                const { data } = await this.$axios.get(
                    `/codesumis/listar-vias-administracion-codesumi/${this.formAgregarMedicamento.articulo.codesumi_id}`
                );

                this.opcionesViasAdministracion = data.length > 0
                    ? data.map(via => ({
                        ...via,
                        nombre: via.nombre?.toUpperCase() ?? ''
                    }))
                    : await this.obtenerTodasLasViasAdministracion();

            } catch (error) {
                this.$toast.error('Ocurrió un error al listar las vías de administración.');
            } finally {
                this.loading.opcionesViasAdministracion = false;
            }
        },

        async obtenerTodasLasViasAdministracion() {
            try {
                const { data } = await this.$axios.get(`/vias-administracion/listar`);
                return data.map(via => ({
                    ...via,
                    nombre: via.nombre?.toUpperCase() ?? ''
                }));
            } catch (error) {
                this.$toast.error('Ocurrió un error al listar todas las vías de administración.');
                return [];
            }
        },

        recalcularCantidad(index) {
            const item = this.articulosPreOrdenados[index];
            const { finalizacion, dosis, frecuencia, unidad_tiempo, horas_vigencia } = item;

            if (!dosis || dosis <= 0) {
                item.cantidad = null;
                return;
            }

            if (finalizacion === 'DOSIS_UNICA') {
                item.cantidad = dosis;
                return;
            }

            if (finalizacion === 'DEFINIDO') {
                if (!frecuencia || !unidad_tiempo || !horas_vigencia) {
                    item.cantidad = null;
                    return;
                }

                let frecuenciaHoras;
                switch (unidad_tiempo) {
                    case 'SEGUNDOS':
                        frecuenciaHoras = frecuencia / 3600;
                        break;
                    case 'MINUTOS':
                        frecuenciaHoras = frecuencia / 60;
                        break;
                    case 'HORAS':
                        frecuenciaHoras = frecuencia;
                        break;
                    default:
                        frecuenciaHoras = null;
                }

                if (!frecuenciaHoras || frecuenciaHoras === 0) {
                    item.cantidad = null;
                    return;
                }

                item.cantidad = Math.ceil((horas_vigencia / frecuenciaHoras) * dosis);
            } else {
                item.cantidad = null;
            }
        },

        guardarDosis(item) {
            item._originalDosis = item.dosis;
        },

        restaurarDosis(item) {
            item.dosis = item._originalDosis;
        },

        guardarFrecuenciaUnidadTiempo(item) {
            item._originalFrecuencia = item.frecuencia;
            item._originalUnidadTiempo = item.unidad_tiempo;
        },

        restaurarFrecuenciaUnidadTiempo(item) {
            item.frecuencia = item._originalFrecuencia;
            item.unidad_tiempo = item._originalUnidadTiempo;
        },

        guardarHorasVigencia(item) {
            item._originalHorasVigencia = item.horas_vigencia;
        },

        restaurarHorasVigencia(item) {
            item.horas_vigencia = item._originalHorasVigencia;
        },

        guardarCantidad(item) {
            item._originalCantidad = item.cantidad;
        },

        restaurarCantidad(item) {
            item.cantidad = item._originalCantidad;
        },

        async manejarReformulacion(articuloHistorico) {
            try {

                this.formAgregarMedicamento = {
                    articulo: articuloHistorico || {},
                    via_administracion: articuloHistorico.via_administracion || null,
                    finalizacion: articuloHistorico.finalizacion,
                    peso_afiliado: this.valoresPersistentes.peso_afiliado,
                    talla_afiliado: this.valoresPersistentes.talla_afiliado,
                    dosis: parseInt(articuloHistorico.dosis),
                    frecuencia: parseInt(articuloHistorico.frecuencia),
                    unidad_tiempo: articuloHistorico.unidad_tiempo,
                    horas_vigencia: parseInt(articuloHistorico.horas_vigencia),
                    cantidad: parseInt(articuloHistorico.cantidad),
                    observacion: articuloHistorico.observacion || '',
                };

                await this.agregarArticulo(true);

            } catch (error) {
                this.$toast.error('Error al reformular el artículo.');
            }
        }

    }
}
</script>
