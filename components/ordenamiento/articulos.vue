<template>
    <div>
        <v-row dense>
            <v-col cols="12" sm="12" md="12">
                <HistoricoMedicamentos ref="historicoMedicamentos" :consulta="consulta"
                    @medicamentoSuspendido="buscarOrdenesActivas()" @reformularMedicamento="reformularMedicamento" />
            </v-col>
        </v-row>
        <v-row dense>
            <v-col cols="12" sm="12" md="12">
                <v-form ref="formularioOrdenarMedicamento" class="mt-3">
                    <v-row dense>
                        <v-col cols="12" sm="12" md="9">
                            <v-autocomplete outlined dense v-model="formOrdenar.articulo"
                                :loading="loading.busquedaArticulo" :items="opcionesArticulos"
                                item-text="codesumi.nombre" return-object :search-input.sync="campoBusquedaArticulo"
                                label="Medicamento *"
                                no-data-text="Escriba el nombre del medicamento para iniciar la búsqueda"
                                hint="Escriba el nombre del medicamento para iniciar la búsqueda"
                                :rules="rules.obligatorio" @change="listarViasAdministracionPorCodesumi()">
                                <template v-slot:item="{ item }">
                                    <v-icon large small :color="getColor(item.codesumi.codigo_lasa)">
                                        mdi-pill
                                    </v-icon>
                                    {{ ' - ' + item.codesumi.nombre }}
                                </template>
                                <template v-slot:selection="{ item }">
                                    <v-icon large small :color="getColor(item.codesumi.codigo_lasa)">
                                        mdi-pill
                                    </v-icon>
                                    {{ ' - ' + item.codesumi.nombre }}
                                </template>
                            </v-autocomplete>
                        </v-col>
                        <v-col cols="12" sm="12" md="3">
                            <v-text-field outlined v-model="formOrdenar.dosis" label="Dosis *" dense type="number"
                                :rules="rules.noNegativo">
                            </v-text-field>
                        </v-col>
                        <v-col cols="12" sm="12" md="3">
                            <v-autocomplete outlined dense v-model="formOrdenar.presentacion"
                                :items="opcionesPresentacion" item-text="nombre" item-value="nombre"
                                :loading="loading.medidas" label="Unidad de Medida Dispensación *"
                                :rules="rules.obligatorio" :disabled="unidadMedidaBloqueada" />
                        </v-col>
                        <v-col cols="12" sm="12" md="2">
                            <v-autocomplete outlined v-model="formOrdenar.via" :items="viasAdministracionCodesumi"
                                label="Vía *" dense :rules="rules.obligatorio" item-text="nombre"
                                item-value="nombre"></v-autocomplete>
                        </v-col>
                        <v-col cols="12" sm="12" md="2">
                            <v-text-field outlined v-model="formOrdenar.frecuencia" label="Frecuencia *" dense
                                type="number" :rules="rules.noNegativo"></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="12" md="3">
                            <v-select outlined dense v-model="formOrdenar.tiempo" label="Unidad de Tiempo *"
                                :items="['Horas', 'Días']" :rules="rules.obligatorio"></v-select>
                        </v-col>
                        <v-col cols="12" sm="12" md="2">
                            <v-text-field outlined dense v-model="formOrdenar.duracion" label="Duración (Días al mes) *"
                                type="number" :rules="rules.noNegativo"></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="12" md="2">
                            <v-select outlined dense v-model="formOrdenar.meses" label="Número de Meses *"
                                :items="[1, 2, 3, 4, 5, 6]" :rules="rules.obligatorio"></v-select>
                        </v-col>
                        <v-col cols="12" sm="12" md="2">
                            <v-text-field dense v-model="cantidadMensual" outlined label="Cantidad Mensual"
                                type="number" readonly>
                            </v-text-field>
                        </v-col>
                        <v-col cols="12" sm="12" md="3">
                            <v-text-field outlined v-model="formOrdenar.cantidadMedico"
                                label="Cantidad Mensual Médico *" type="number" dense :rules="rules.noNegativo">
                            </v-text-field>
                        </v-col>
                        <!--                            <v-col cols="12" sm="12" md="5">-->
                        <!--                                <v-autocomplete dense v-model="formOrdenar.rep_id" :loading="loading.busquedaRep"-->
                        <!--                                    :items="opcionesRep" item-text="nombre" item-value="id" label="Prestador *"-->
                        <!--                                    :rules="rules.obligatorio"></v-autocomplete>-->
                        <!--                            </v-col>-->
                        <v-col cols="12" sm="12" md="12">
                            <v-textarea outlined auto-grow v-model="formOrdenar.observacion" counter label="Observación *"
                                :rules="rules.observacion" />
                        </v-col>
                        <v-col cols="12" sm="12" md="12" class="text-right">
                            <v-btn :disabled="loading.agregarArticulo" color="warning" small
                                @click="limpiarFormulario()">Limpiar
                            </v-btn>
                            <v-btn :disabled="loading.agregarArticulo" color="success" small
                                @click="agregarArticulo()">Agregar
                            </v-btn>
                        </v-col>
                    </v-row>
                </v-form>
            </v-col>
        </v-row>
        <v-row>
            <v-col cols="12" sm="12" md="12">
                <v-divider></v-divider>
            </v-col>
            <v-col cols="12" sm="12" md="12" ref="tablaMedicamentos">
                <v-data-table :headers="headersPreOrden" :items="medicamentosSeleccionados"
                    no-data-text="Agregue medicamentos para visualizarlos aquí" :loading="loading.agregarArticulo"
                    loading-text="Agregando... Por favor espere">

                    <template v-slot:[`item.articulo.codesumi.nombre`]="{ item }">
                        <v-icon large small :color="getColor(item.articulo.codesumi?.codigo_lasa)">
                            mdi-pill
                        </v-icon>
                        {{ ' - ' + item.articulo.codesumi?.nombre }}
                    </template>

                    <template v-slot:[`item.presentacion`]="{ item }">
                        <v-edit-dialog :return-value.sync="item.presentacion" large persistent cancel-text="Cancelar"
                            save-text="Guardar">
                            {{ item.presentacion || '—' }}
                            <template v-slot:input>
                                <v-select v-model="item.presentacion" :items="item.opcionesPresentacionFiltradas"
                                    label="Presentación" item-text="nombre" item-value="nombre" dense outlined />
                            </template>
                        </v-edit-dialog>
                    </template>

                    <template v-slot:[`item.via`]="{ item }">
                        <v-edit-dialog :return-value.sync="item.via" large persistent cancel-text="Cancelar"
                            save-text="Guardar">
                            {{ item.via || '—' }}
                            <template v-slot:input>
                                <v-select v-model="item.via" :items="item.viasDisponibles" label="Vía de administración"
                                    item-text="nombre" item-value="nombre" dense outlined />
                            </template>
                        </v-edit-dialog>
                    </template>

                    <template v-slot:[`item.dosis`]="{ item }">
                        <v-edit-dialog :return-value.sync="item.dosis" large persistent cancel-text="Cancelar"
                            save-text="Guardar">
                            {{ item.dosis || '—' }}
                            <template v-slot:input>
                                <v-text-field v-model="item.dosis" label="Dosis" single-line dense />
                            </template>
                        </v-edit-dialog>
                    </template>

                    <template v-slot:[`item.frecuencia`]="{ item }">
                        <v-edit-dialog :return-value.sync="item.frecuencia" large persistent cancel-text="Cancelar"
                            save-text="Guardar">
                            {{ item.frecuencia || '—' }}
                            <template v-slot:input>
                                <v-text-field v-model="item.frecuencia" label="Frecuencia" single-line dense />
                            </template>
                        </v-edit-dialog>
                    </template>

                    <template v-slot:[`item.duracion`]="{ item }">
                        <v-edit-dialog :return-value.sync="item.duracion" large persistent cancel-text="Cancelar"
                            save-text="Guardar">
                            {{ item.duracion || '—' }}
                            <template v-slot:input>
                                <v-text-field v-model="item.duracion" label="Duración" single-line dense />
                            </template>
                        </v-edit-dialog>
                    </template>

                    <template v-slot:[`item.cantidadMedico`]="{ item }">
                        <v-text-field v-model="item.cantidadMedico" type="number" min="1" dense hide-details
                            style="max-width: 80px" />
                    </template>

                    <template v-slot:[`item.cantidadMensual`]="{ item }">
                        <td>
                            {{
                                calcularCantidadMensual(item)
                            }}
                        </td>
                    </template>

                    <template v-slot:[`item.tiempo`]="{ item }">
                        <v-edit-dialog :return-value.sync="item.tiempo" large persistent save-text="Guardar"
                            cancel-text="Cancelar">
                            {{ item.tiempo || '—' }}
                            <template v-slot:input>
                                <v-select v-model="item.tiempo" :items="['Horas', 'Días']" dense outlined
                                    hide-details />
                            </template>
                        </v-edit-dialog>
                    </template>

                    <template v-slot:[`item.descripcion`]="{ item }">
                        <td>{{ item | descripcion }}</td>
                    </template>

                    <template v-slot:[`item.meses`]="{ item }">
                        <td>
                            <v-text-field type="number" v-model="item.meses"></v-text-field>
                        </td>
                    </template>

                    <template v-slot:[`item.observacion`]="{ item }">
                        <div class="d-flex justify-space-between align-center" style="max-width: 100%;">
                            <span style="white-space: normal; max-width: 100%; word-break: break-word;">
                                {{ item.observacion || 'Sin observación' }}
                            </span>

                            <v-tooltip bottom>
                                <template v-slot:activator="{ on, attrs }">
                                    <v-btn icon small class="ml-2" v-bind="attrs" v-on="on"
                                        @click="abrirEditorObservacion(item)">
                                        <v-icon small color="warning">mdi-pencil</v-icon>
                                    </v-btn>
                                </template>
                                <span>Editar observación</span>
                            </v-tooltip>
                        </div>
                    </template>

                    <template v-slot:[`item.autorizacion`]="{ item }">
                        <v-chip small dark :color="item.articulo.codesumi.requiere_autorizacion ? 'error' : 'primary'">
                            {{ item.articulo.codesumi.requiere_autorizacion ? "Si" : "No" }}
                        </v-chip>
                    </template>

                    <template v-slot:[`item.acciones`]="{ index }">
                        <v-tooltip bottom>
                            <template v-slot:activator="{ on, attrs }">
                                <v-icon small color="error" v-bind="attrs" v-on="on"
                                    @click="medicamentosSeleccionados.splice(index, 1)">
                                    mdi-close-circle
                                </v-icon>
                            </template>
                            <span>Eliminar de la Selección</span>
                        </v-tooltip>
                    </template>
                </v-data-table>
            </v-col>
            <v-col cols="12" sm="12" md="12" class="text-right" v-if="medicamentosSeleccionados.length > 0">
                <v-btn :disabled="loading.articulosActivos" color="primary" @click="ordenarMedicamentos()" small>Ordenar
                </v-btn>
            </v-col>
            <v-col cols="12" sm="12" md="12">
                <v-data-table :items="ordenesActivas" :loading="loading.articulosActivos"
                    loading-text="Cargando... Por favor espere" no-data-text="No hay ordenes activas para mostrar"
                    :headers="headersOrdenesActivas">
                    <template v-slot:[`item.meses`]="{ item }">
                        {{ item.meses === 1 ? `${item.meses} Mes` : `${item.meses} Meses` }}
                    </template>
                    <template v-slot:[`item.direccionamiento`]="{ item }">
                        {{ item.rep?.nombre ?? "Sin Direccionamiento" }}
                    </template>
                    <template v-slot:[`item.estado`]="{ item }">
                        <v-chip dark small :color="obtenerEstado(item.estado_id).color">{{
                            item.estado.nombre
                            }}
                        </v-chip>
                    </template>
                    <template v-slot:[`item.acciones`]="{ item }">
                        <v-tooltip bottom v-if="item.estado_id !== 3 && item.estado_id !== 44">
                            <template v-slot:activator="{ on, attrs }">
                                <v-icon color="primary" v-bind="attrs" v-on="on" @click="descargarOrden(item)">
                                    mdi-file-download-outline
                                </v-icon>
                            </template>
                            <span>Descargar orden</span>
                        </v-tooltip>
                        <v-tooltip bottom
                            v-if="item.estado_id === 3 && item.estado_id !== 44 && afiliado?.entidad?.id === 1">
                            <template v-slot:activator="{ on, attrs }">
                                <v-icon color="blue-grey" v-bind="attrs" v-on="on"
                                    @click="descargarAutorizacionFomag(item)">
                                    mdi-arrow-down-circle
                                </v-icon>
                            </template>
                            <span>Descargar autorización FOMAG</span>
                        </v-tooltip>
                        <v-tooltip bottom v-if="item.estado_id == 45">
                            <template v-slot:activator="{ on, attrs }">
                                <v-icon color="warning" v-bind="attrs" v-on="on" @click="irAMipres">
                                    mdi-web
                                </v-icon>
                            </template>
                            <span>Ir a MIPRES</span>
                        </v-tooltip>
                    </template>
                </v-data-table>
            </v-col>
        </v-row>
        <v-dialog v-model="dialogObservacion" max-width="600px">
            <v-card>
                <v-card-title>
                    <v-icon left>mdi-comment-edit</v-icon>Actualizar observación
                </v-card-title>
                <v-card-text>
                    <v-textarea v-model="observacionTemporal" label="Observación" auto-grow outlined rows="3"
                        counter="500" />
                </v-card-text>
                <v-card-actions>
                    <v-spacer />
                    <v-btn small color="error" @click="dialogObservacion = false">Cancelar</v-btn>
                    <v-btn small color="success" @click="guardarObservacion">Guardar</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

    </div>
</template>
<script>
import {
    mapActions
} from "vuex";
import HistoricoMedicamentos from "@/components/ordenamiento/historicoMedicamentos.vue";
import Swal from 'sweetalert2';

export default {
    name: "articulos",
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
    middleware({
        $can,
        redirect
    }) {
        if (!$can("blog.vista")) {
            return redirect("/");
        }
    },
    components: {
        HistoricoMedicamentos,
    },

    data() {
        return {
            formOrdenar: {
                articulo: null,
                presentacion: "",
                via: "",
                dosis: "",
                frecuencia: "",
                tiempo: "",
                duracion: "",
                meses: "",
                cantidadMedico: "",
                rep_id: null,
                observacion: '',
                descripcion: "",
                alertaDetalleId: null,
                fechaVigencia: new Date(
                    Date.now() - new Date().getTimezoneOffset() * 60000
                )
                    .toISOString()
                    .substring(0, 10),
            },
            opcionesArticulos: [],
            opcionesRep: [],
            viasAdministracionCodesumi: [],
            loading: {
                busquedaArticulo: false,
                busquedaRep: false,
                agregarArticulo: false,
                articulosActivos: false,
                medidas: false,
            },
            campoBusquedaArticulo: null,
            campoBusquedaRep: null,
            unidadMedidaBloqueada: false,
            dialogObservacion: false,
            observacionTemporal: '',
            itemObservacion: null,
            rules: {
                obligatorio: [(v) => !!v || "Este campo es requerido"],
                noNegativo: [(v) => v > 0 || "Este campo debe ser mayor a 0"],
                observacion: [
                    (v) => !!v || "La observación es requerida",
                    (v) =>
                        (v && v.length <= 200) ||
                        "La observación debe ser de máximo 200 caracteres",
                ],
            },
            opcionesPresentacion: [],
            opcionesVia: [
                "Oral",
                "Intramuscular",
                "Intravenosa",
                "Subcutánea",
                "Sublingual",
                "Inhalatoria",
                "Transdérmica",
                "Dérmica",
                "Nasal",
                "Oftálmica",
                "Ótica",
                "Tópica",
                "Rectal",
                "Vaginal",
                "Enjuague",
                "Intratectual",
                "Enteral",
            ],
            alertasFarmacologicasInteracciones: [],
            alertasFarmacologicasNoInteracciones: [],
            medicamentosSeleccionados: [],
            headersPreOrden: [
                { text: "Medicamento", value: "articulo.codesumi.nombre" },
                { text: "Presentación", value: "presentacion", align: "center" },
                { text: "Vía", value: "via", align: "center" },
                { text: "Dosis", value: "dosis", align: "center" },
                { text: "Frecuencia", value: "frecuencia", align: "center" },
                { text: "Duración", value: "duracion", align: "center" },
                {
                    text: "Cantidad Médico",
                    value: "cantidadMedico",
                    align: "center",
                },
                {
                    text: "Cantidad Mensual",
                    value: "cantidadMensual",
                    align: "center",
                },
                { text: "N° Meses", value: "meses", align: "center" },
                { text: "Fecha de Vigencia", value: "fechaVigencia", align: "center" },
                { text: "Unidad de tiempo", value: "tiempo", align: "center" },
                { text: "Observación", value: "observacion", align: "center" },
                { text: "Acciones", value: "acciones", align: "center", sortable: false },
            ],
            ordenesActivas: [],
            headersOrdenesActivas: [{
                text: "Medicamento",
                value: "codesumi.nombre"
            },
            {
                text: "Meses",
                value: "meses",
                align: "center"
            },
            {
                text: "Fecha de Vigencia",
                value: "fecha_vigencia",
                align: "center"
            },
            {
                text: "Dosificación",
                value: "dosificacion_medico",
                align: "center"
            },
            {
                text: "Direccionamiento",
                value: "direccionamiento",
                align: "center"
            },
            {
                text: "Estado",
                value: "estado",
                align: "center"
            },
            {
                text: "Acciones",
                value: "acciones",
                align: "center",
                sortable: false,
            },
            ],
        };
    },
    computed: {
        cantidadMensual() {
            let cantidad = 0;
            if (this.formOrdenar.tiempo == "Horas") {
                cantidad = Math.round(
                    (24 / this.formOrdenar.frecuencia) *
                    this.formOrdenar.dosis *
                    this.formOrdenar.duracion
                );
            } else {
                cantidad = Math.round(
                    (this.formOrdenar.duracion / this.formOrdenar.frecuencia) *
                    this.formOrdenar.dosis
                );
            }

            return cantidad || 0;
        },
    },
    watch: {
        campoBusquedaArticulo(newValue) {
            if (newValue && newValue.length === 4) {
                this.buscarMedicamento();
            }
        },
    },
    filters: {
        descripcion: (item) => {
            if (item.tiempo == "Horas")
                return `${item.dosis} ${item.presentacion} ${item.via} cada ${item.frecuencia} Horas por ${item.duracion} días`;
            else
                return `${item.dosis} ${item.presentacion} ${item.via} cada ${item.frecuencia} Días por ${item.duracion} días`;
        },
    },
    mounted() {
        this.listarPrestadores();
        this.buscarOrdenesActivas();
        this.listarMedidasDispensacion();
    },

    methods: {
        ...mapActions("app", ["setPreload"]),

        buscarMedicamento(nombre = null) {
            this.loading.busquedaArticulo = true;

            const termino = nombre || this.campoBusquedaArticulo;

            this.$axios
                .post("medicamentos/listarMedicamentoOrdenamiento", {
                    nombre: termino,
                    entidad_id: this.afiliado.entidad_id,
                })
                .then((res) => {
                    this.opcionesArticulos = res.data;

                    if (nombre && res.data.length) {
                        this.ordenarMedicamentoDesdePaquete(res.data[0]);
                    }
                })
                .catch((e) => {
                    this.$toast.error("Ocurrió un error al listar los medicamentos");
                })
                .finally(() => {
                    this.loading.busquedaArticulo = false;
                });
        },

        listarPrestadores() {
            this.loading.busquedaRep = true;
            this.$axios
                .post(`reps/listarFarmaciasSumi`)
                .then((res) => {
                    this.opcionesRep = res.data.map((rep) => {
                        return {
                            id: rep.id,
                            nombre: `${rep.prestadores.nit} - ${rep.nombre} - (${rep.municipio.nombre})`,
                        };
                    });
                })
                .catch((e) => {
                    this.$toast.error("Ocurrió un error al listar los prestadores");
                })
                .finally(() => {
                    this.loading.busquedaRep = false;
                });
        },

        async agregarArticulo() {
            if (!this.$refs.formularioOrdenarMedicamento.validate()) {
                this.$toast.error("Por favor complete los campos obligatorios");
                return;
            }

            this.loading.agregarArticulo = true;

            try {
                this.formOrdenar.descripcion = this.$options.filters.descripcion(this.formOrdenar);

                const resultAlergico = await this.buscarAlergico();
                if (resultAlergico === "Alergia detectada") {
                    throw "Alergia detectada"; // Detener el flujo si hay alergia
                }

                const resultDesabastecimiento = await this.buscarDesabastecimiento();
                if (resultDesabastecimiento === "Desabastecimiento detectado") {
                    throw "Desabastecimiento detectado"; // Detener el flujo si hay desabastecimiento
                }

                const resultAlertas = await this.buscarAlertas();
                if (resultAlertas.resultado) {
                    // Mostrar el diálogo de alerta si hay interacciones y pasar el alertaDetalleId
                    await this.abrirDialogoAlerta("Alerta Farmacológica", resultAlertas.mensaje);
                } else {
                    // Proceder con el ordenamiento si no hay alertas
                    // this.verificarMipresCodesumi(this.formOrdenar.articulo)
                    this.procesarOrdenamiento();
                }

            } catch (e) {
                if (e === "Alergia detectada" || e === "Desabastecimiento detectado") {
                    this.$toast.error(e);
                } else {
                    console.error("Error al procesar la solicitud: " + (e.response?.data?.message || e));
                }
            } finally {
                this.loading.agregarArticulo = false;
            }
        },

        //Se verifica si el articulo esta marcado como mipres, en caso de retornar un true se muestra un swal y se abre en el navegador la pagina de mipres
        //Se reciben como parametros la entidad del afiliado y el id del codesumi
        // verificarMipresCodesumi(codesumi) {
        //     this.$axios.get('ordenamiento/verificar-mipres', {
        //         params: {
        //             entidad_afiliado: this.afiliado.entidad_id,
        //             codesumi_id: codesumi.codesumi_id
        //         }
        //     }).then((res) => {
        //         if (res.data.requiere_mipres) {
        //             return this.$swal({
        //                 title: "¡Atención!",
        //                 text: "Este medicamento requiere mipres",
        //                 type: "warning",
        //             },
        //                 this.irAMipres()
        //             );
        //         }
        //     }).catch((error) => {
        //         console.log(error.response.data.error)
        //     })
        // },

        crearAuditoria(acepto, alertaDetalleId) {
            const data = {
                acepto: acepto,
                alerta_detalle_id: alertaDetalleId,
                usuario_registra_id: this.$store.state.auth.usuario.id,
                consulta_id: this.consulta,
                estado_alerta_id: 1
            };

            this.$axios.post('alertas/crearAuditoria', data)
                .then(res => {
                    console.log('Auditoría creada exitosamente');
                })
                .catch(error => {
                    console.error('Error al crear auditoría', error);
                });
        },


        abrirDialogoAlerta(mensaje, tipoAlerta, alertaDetalleId) {
            return Swal.fire({
                title: `<div class="custom-swal-title">${tipoAlerta}</div>`,
                html: `<div class="custom-swal-text">${mensaje}</div>`,
                icon: "info",
                showCancelButton: true,
                confirmButtonText: 'Aceptar y continuar',
                cancelButtonText: 'Cancelar',
                reverseButtons: true,
                cancelButtonColor: 'red',
                confirmButtonColor: 'blue',
            }).then((result) => {
                if (result.value) {
                    // Llama a crearAuditoria y le pasas el id de la alerta
                    this.crearAuditoria('Si', alertaDetalleId);
                    this.procesarOrdenamiento();
                } else if (result.dismiss === Swal.DismissReason.cancel) {
                    this.crearAuditoria('No', alertaDetalleId);
                    this.limpiarFormulario();
                }
            }).catch((error) => {
                console.error("Error en Swal:", error);
            });
        },


        procesarOrdenamiento() {
            let data = {};
            for (const val in this.formOrdenar) {
                data[val] = this.formOrdenar[val];
            }
            this.medicamentosSeleccionados.push(data);
            this.$toast.success("Medicamento agregado correctamente");
            this.limpiarFormulario();
        },

        limpiarFormulario() {
            this.formOrdenar = {
                articulo: null,
                presentacion: "",
                via: "",
                dosis: "",
                frecuencia: "",
                tiempo: "",
                duracion: "",
                meses: "",
                cantidadMedico: "",
                rep_id: null,
                observacion: "",
                descripcion: "",
                fechaVigencia: new Date(
                    Date.now() - new Date().getTimezoneOffset() * 60000
                )
                    .toISOString()
                    .substring(0, 10),
            };
            this.$refs.formularioOrdenarMedicamento.resetValidation();
        },

        buscarAlergico() {
            return this.$axios
                .post("/alertas/buscarAlergico", {
                    afiliado_id: this.afiliado.id,
                    codesumi_id: this.formOrdenar.articulo.codesumi.id,
                })
                .then((res) => {
                    // Si la respuesta es exitosa (200), no hay alergia
                    return false;
                })
                .catch((error) => {
                    // Verificar si es un error controlado (400)
                    if (error.response?.status === 400 && error.response.data?.error) {
                        return this.$swal({
                            type: "error",
                            title: "¡El paciente es alérgico a este medicamento!",
                            text: `Observación: ${error.response.data.error}`,
                        }).then(() => {
                            this.limpiarFormulario();
                            return Promise.reject("Alergia detectada"); // Detener flujo
                        });
                    }
                    return Promise.reject("Error en la búsqueda de alergias");
                });
        },

        buscarDesabastecimiento() {
            return this.$axios
                .post("/alertas/buscarDesabastecimiento", {
                    medicamento: {
                        id: this.formOrdenar.articulo.codesumi.id,
                    },
                })
                .then((res) => {
                    if (res.data) {
                        const {
                            tipo_alerta,
                            mensaje,
                            alertaDetalleId
                        } = res.data;

                        if (tipo_alerta != null) {
                            // Llama a abrirDialogo para mostrar la alerta
                            return this.abrirDialogoAlerta(mensaje, tipo_alerta, alertaDetalleId).then(() => {
                                // Continúa con el flujo sin detener el ordenamiento
                                return false; // Retorna false para indicar que no se detiene el flujo
                            });
                        } else {
                            // Si es cualquier otra alerta, se detiene el flujo con Swal
                            return this.$swal({
                                type: "warning",
                                title: "¡Atención!",
                                text: mensaje,
                            }).then(() => {
                                this.limpiarFormulario();
                                return Promise.reject("Desabastecimiento detectado");
                            });
                        }
                    }
                    return false; // No hay desabastecimiento
                });
        },


        buscarAlertas() {
            // Obtener IDs de todos los medicamentos seleccionados, incluyendo el que se va a agregar
            const medicamentosSeleccionadosIds = [
                ...this.medicamentosSeleccionados.map(medicamento => medicamento.articulo.codesumi.id),
                this.formOrdenar.articulo.codesumi.id
            ];

            return this.$axios
                .post("/alertas/verificarInteraccion", {
                    medicamentosSeleccionados: medicamentosSeleccionadosIds
                })
                .then((res) => {
                    const resultadoAlerta = res.data[0]; // Acceder al primer objeto del array

                    if (resultadoAlerta.resultado && resultadoAlerta.interacciones.length > 0) {
                        const {
                            interacciones
                        } = resultadoAlerta;
                        // Concatenar todas las interacciones en un solo mensaje
                        let mensajeAlerta = interacciones.map(interaccion =>
                            `Tipo de alerta: ${interaccion.tipo_alerta}\nMensaje: ${interaccion.mensaje}`
                        ).join('\n\n');

                        // Capturar el ID de la primera interacción
                        const alertaDetalleId = interacciones[0].id;

                        return {
                            resultado: true,
                            mensaje: mensajeAlerta,
                            alertaDetalleId: alertaDetalleId // Devolver el alertaDetalleId
                        };
                    }

                    return {
                        resultado: false
                    }; // No hay interacciones
                })
                .catch((e) => {
                    this.$toast.error(`Error al buscar alertas: ${e?.response?.data.message || e}`);
                    return {
                        resultado: false
                    };
                });
        },

        ordenarMedicamentos() {
            if (
                this.medicamentosSeleccionados.filter(s => !s.meses).length === 0 &&
                this.medicamentosSeleccionados.filter(s => parseInt(s.meses) <= 0).length === 0
            ) {
                this.medicamentosSeleccionados.forEach((item) => {
                    item.descripcion =
                        item.tiempo === "Horas"
                            ? `${item.dosis} ${item.presentacion} ${item.via} cada ${item.frecuencia} Horas por ${item.duracion} días`
                            : `${item.dosis} ${item.presentacion} ${item.via} cada ${item.frecuencia} Días por ${item.duracion} días`;
                });

                this.setPreload(true);
                this.$axios
                    .post(
                        `/ordenamiento/generarOrdenamiento/${this.consulta}/1`,
                        this.medicamentosSeleccionados
                    )
                    .then(() => {
                        this.medicamentosSeleccionados = [];
                        this.$swal({
                            title: "Éxito",
                            text: "Orden creada correctamente",
                            type: 'success'
                        });
                        this.buscarOrdenesActivas();
                        this.$refs.historicoMedicamentos.listarHistoricoMedicamentos();
                    })
                    .catch((error) => {
                        if (
                            error.response &&
                            error.response.data &&
                            error.response.data.error
                        ) {
                            this.$swal({
                                title: "Error",
                                text: error.response.data.error,
                                type: "error",
                            });
                        } else {
                            return this.$toast.error(
                                "Ocurrió un error, por favor intentalo de nuevo más tarde!"
                            );
                        }
                    })
                    .finally(() => {
                        this.setPreload(false);
                    });
            } else {
                this.$toast.error('Hay valores incorrectos en la cantidad de meses');
            }
        },

        buscarOrdenesActivas() {
            this.loading.articulosActivos = true;

            this.$axios
                .get(`ordenamiento/ordenes-activas/${this.consulta}/1`)
                .then((res) => {
                    this.ordenesActivas = res.data;
                })
                .catch((error) => {
                    this.$toast.error("Ocurrió un error al cargar las ordenes activas");
                })
                .finally(() => {
                    this.loading.articulosActivos = false;
                });
        },

        obtenerEstado(estadoId) {
            switch (parseInt(estadoId)) {
                case 1:
                case 4:
                    return {
                        color: "success"
                    };
                case 3:
                    return {
                        color: "warning"
                    };
                case 5:
                case 20:
                case 21:
                case 50:
                case 44:
                    return {
                        color: "error"
                    };
                case 34:
                case 45:
                    return {
                        color: "info"
                    };
                default:
                    return {
                        color: "gray"
                    };
            }
        },

        descargarOrden(item) {
            this.setPreload(true);

            let pdf = {
                tipo: "medicamento",
                id: item.orden_id,
                filtro: item.estado_id,
                detalles: {
                    id: item.id,
                },
            };

            this.$axios
                .post("/pdf", pdf, {
                    responseType: "arraybuffer",
                })
                .then((res) => {
                    let blob = new Blob([res.data], {
                        type: "application/pdf",
                    });
                    let link = document.createElement("a");
                    link.href = window.URL.createObjectURL(blob);
                    window.open(link.href, "_blank");
                })
                .catch((res) => {
                    this.$toast.error("Ocurrió un error al descargar la orden");
                })
                .finally(() => {
                    this.setPreload(false);
                });
        },

        descargarAutorizacionFomag(item) {
            this.setPreload(true);

            this.$axios.post("/medicamentos/autorizacion-fomag", {
                id: item.orden_id,
                filtro: item.estado_id,
                detalles: {
                    id: item.id,
                },
            }, {
                responseType: "arraybuffer",
            })
                .then((res) => {
                    let blob = new Blob([res.data], { type: "application/pdf" });
                    let link = document.createElement("a");
                    link.href = window.URL.createObjectURL(blob);
                    window.open(link.href, "_blank");
                })
                .catch(() => {
                    this.$toast.error("Ocurrió un error al descargar la orden");
                })
                .finally(() => {
                    this.setPreload(false);
                });
        },

        reformularMedicamento(data) {
            // return console.log(data);
            data.forEach(s => {
                this.medicamentosSeleccionados.push(s);
            });

            this.$nextTick(() => {
                const tablaMedicamentos = this.$refs.tablaMedicamentos;
                if (tablaMedicamentos) {
                    tablaMedicamentos.scrollIntoView({ behavior: 'smooth' });
                }
                this.$toast.success('Se ha agregado el medicamento correctamente')
            });
        },
        irAMipres() {
            const url = 'https://mipres.sispro.gov.co/MIPRESNOPBS/Login.aspx?ReturnUrl=%2fMIPRESNOPBS%2fLogoff.aspx';
            window.open(url, '_blank'); // Abre la URL en una nueva pestaña
        },

        getColor(codigo) {
            const colores = {
                Azul: 'blue',
                Amarillo: 'yellow',
                Verde: 'green',
                Naranja: 'orange'
            };
            return colores[codigo] || 'white';
        },

        listarViasAdministracionPorCodesumi() {
            const articulo = this.formOrdenar.articulo;

            if (!articulo || !articulo.codesumi_id) {
                this.viasAdministracionCodesumi = [];
                this.formOrdenar.presentacion = null;
                this.unidadMedidaBloqueada = false;
                return;
            }

            this.$axios.get('codesumis/listar-vias-administracion-codesumi/' + articulo.codesumi_id).then((res) => {
                if (res.data.length > 0) {
                    this.viasAdministracionCodesumi = res.data;
                } else {
                    this.listarTodasLasViasAdministracion();
                }
            }).catch((error) => {
                this.$toast.error('Error al listar las vías de administración');
                console.log(error.response?.data?.error || error);
            });

            const unidadId = articulo.codesumi?.unidad_medida_dispensacion_id;
            if (unidadId) {
                const unidad = this.opcionesPresentacion.find((item) => item.id === unidadId);
                if (unidad) {
                    this.formOrdenar.presentacion = unidad.nombre;
                    this.unidadMedidaBloqueada = true;
                } else {
                    this.formOrdenar.presentacion = null;
                    this.unidadMedidaBloqueada = false;
                }
            } else {
                this.formOrdenar.presentacion = null;
                this.unidadMedidaBloqueada = false;
            }

            const nuevaObservacion = articulo?.codesumi.observacion;

            if (nuevaObservacion && typeof nuevaObservacion === 'string' && nuevaObservacion.trim().length > 0) {
                const existente = this.formOrdenar.observacion || '';
                this.formOrdenar.observacion = `${nuevaObservacion.trim()}\n${existente}`.trim();
            }


        },

        listarTodasLasViasAdministracion() {
            return this.$axios.get('vias-administracion/listar')
                .then((res) => {
                    this.viasAdministracionCodesumi = res.data;
                })
                .catch((error) => {
                    this.$toast.error('Error al listar todas las vías de administración');
                    console.log(error.response?.data?.error || error);
                });
        },
        // asignarPresentacion() {
        //     if (!this.formOrdenar.articulo || !this.formOrdenar.articulo.codesumi) {
        //             this.formOrdenar.presentacion = '';
        //             return;
        //         }

        //     const forma = this.formOrdenar.articulo.codesumi.forma_farmaceuticaffm;


        //   if (forma && forma.nombre_abreviado != null) {
        //     this.formOrdenar.presentacion = forma.nombre_abreviado;
        //     }else {
        //         this.formOrdenar.presentacion = '';
        //     }
        // }
        async listarMedidasDispensacion() {
            try {
                this.loading.medidas = true;
                const res = await this.$axios.post('unidades-medidas-medicamentos-dispensacion/listarTodas');
                this.opcionesPresentacion = res.data;
            } catch (error) {
                this.$toas.error('Ha ocurrido un Error al listar las Medidas');
            } finally {
                this.loading.medidas = false;
            }
        },

        async ordenarMedicamentoDesdePaquete(med) {
            const hoy = new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
                .toISOString().substring(0, 10);

            const item = {
                articulo: med,
                presentacion: '',
                via: '',
                dosis: '1',
                frecuencia: '1',
                tiempo: 'Horas',
                duracion: '1',
                meses: '1',
                cantidadMedico: '1',
                rep_id: this.afiliado.ips || null,
                observacion: 'Agregado desde paquete',
                alertaDetalleId: null,
                fechaVigencia: hoy,
                viasDisponibles: [],
                opcionesPresentacionFiltradas: []
            };

            await this.cargarInfoMedicamentoDesdePaquete(item);

            item.descripcion = item.tiempo === 'Horas'
                ? `${item.dosis} ${item.presentacion} ${item.via} cada ${item.frecuencia} Horas por ${item.duracion} días`
                : `${item.dosis} ${item.presentacion} ${item.via} cada ${item.frecuencia} Días por ${item.duracion} días`;

            this.medicamentosSeleccionados.push(item);

        },

        async cargarInfoMedicamentoDesdePaquete(item) {
            const codesumiId = item.articulo.codesumi_id;

            try {
                const { data: vias } = await this.$axios.get(`/codesumis/listar-vias-administracion-codesumi/${codesumiId}`);

                if (vias.length > 0) {
                    item.viasDisponibles = vias;
                } else {
                    await this.listarTodasLasViasAdministracion();
                    item.viasDisponibles = this.viasAdministracionCodesumi;
                }

            } catch (e) {
                await this.listarTodasLasViasAdministracion();
                item.viasDisponibles = this.viasAdministracionCodesumi;
            }

            const unidadId = item.articulo.codesumi?.unidad_medida_dispensacion_id;
            item.opcionesPresentacionFiltradas = unidadId
                ? this.opcionesPresentacion.filter(p => p.id === unidadId)
                : this.opcionesPresentacion;

            item.presentacion = unidadId
                ? item.opcionesPresentacionFiltradas[0]?.nombre || ''
                : '';
        },

        calcularCantidadMensual(item) {
            const dosis = parseFloat(item.dosis);
            const frecuencia = parseFloat(item.frecuencia);
            const duracion = parseFloat(item.duracion);

            if (!dosis || !frecuencia || !duracion) return 0;

            return item.tiempo === "Horas"
                ? Math.round((24 / frecuencia) * dosis * duracion)
                : Math.round((duracion / frecuencia) * dosis);
        },

        abrirEditorObservacion(item) {
            this.itemObservacion = item;
            this.observacionTemporal = item.observacion || '';
            this.dialogObservacion = true;
        },
        guardarObservacion() {
            if (this.itemObservacion) {
                this.itemObservacion.observacion = this.observacionTemporal.trim();
            }
            this.dialogObservacion = false;
        },

    },
};

</script>
<style>
.custom-swal-popup {
    font-family: Arial, sans-serif !important;
}

.custom-swal-title {
    font-size: 18px !important;
}

.custom-swal-text {
    font-size: 14px !important;
}
</style>
