<template>
    <div>

        <!-- Preload -->
        <template>
            <div class="text-center">
                <v-dialog v-model="preload" persistent width="300">
                    <v-card color="primary" dark>
                        <v-card-text>
                            Tranquilo procesamos tu solicitud !
                            <v-progress-linear indeterminate color="white" class="mb-0"></v-progress-linear>
                        </v-card-text>
                    </v-card>
                </v-dialog>
            </div>
        </template>

        <!-- card de botones y filtros -->
        <v-card class="mx-100">
            <div>

                <v-row class="mx-2">
                    <v-col md="3" lg="3" xl="3" sm="6" cols>
                        <v-autocomplete dense :items="entidades" item-text="nombre" item-value="id"
                            v-model="filtro.entidad_id" label="Entidad" outlined>
                        </v-autocomplete>
                    </v-col>

                    <v-col md="2" lg="2" xl="2" sm="6" cols>
                        <v-text-field dense v-model="filtro.documento" label="Documento Afiliado" outlined>
                        </v-text-field>
                    </v-col>

                    <v-col md="3" lg="3" xl="3" sm="6" cols>
                        <v-autocomplete dense :items="especialidades" item-text="nombre" item-value="id"
                            v-model="filtro.especialidad_id" label="Especialidad" outlined>
                        </v-autocomplete>
                    </v-col>

                    <v-col md="4" lg="4" xl="4" sm="6" cols>
                        <v-autocomplete v-model="filtro.rep_id" label="Nit o Nombre del Prestador (Sede Atención)"
                            :items="reps" item-value="id" item-text="nombre" :search-input.sync="rep" dense outlined>
                        </v-autocomplete>
                    </v-col>

                    <v-col md="2" lg="2" xl="2" sm="6" cols>
                        <v-btn-toggle background-color="white" dark>
                            <v-btn v-if="$can('cups.listar')" small color="success"
                                @click="listarConcurrencia()">Filtrar</v-btn>
                            <v-btn v-if="$can('cups.listar')" small class="ml-2" color="error"
                                @click="limpiar()">Limpiar</v-btn>
                        </v-btn-toggle>
                    </v-col>
                </v-row>
            </div>

            <v-divider class="mt-2"></v-divider>

            <!-- tabla de cups -->
            <v-data-table :headers="headers" :items="concurrencias" class="elevation-1 mt-4" loading-text="cargando..."
                hide-default-footer disable-pagination no-data-text="Sin datos para mostrar" dense>

                <template v-slot:[`item.auditor_crea_personalizado`]="{ item }">
                    {{ item.auditor_crea?.nombre || '' }} {{ item.auditor_crea?.apellido || '' }}
                </template>

                <template v-slot:[`item.afiliado`]="{ item }">
                    {{ nombreCompletoAfiliado(item.afiliado) }}
                </template>

                <template v-slot:[`item.marcacion`]="{ item }">
                    <v-tooltip top v-if="$can('cups.guardar')">
                        <template v-slot:activator="{ on, attrs }">
                            <v-icon color="warning" v-bind="attrs" v-on="on">
                                mdi-clipboard-account
                            </v-icon>
                        </template>
                        <span>Marcaciones</span>
                    </v-tooltip>
                </template>

                <template v-slot:[`item.dias_estancia`]="{ item }">
                    <v-chip small dark :class="semaforo(item.dias_estancia)">
                        {{ `${item.dias_estancia} DÍA(S)` }}</v-chip>
                </template>

                <template v-slot:[`item.acciones`]="{ item }">
                    <v-tooltip top v-if="$can('cups.guardar')">
                        <template v-slot:activator="{ on, attrs }">
                            <v-icon color="primary" small v-bind="attrs" v-on="on"
                                @click="buscarAfiliado(item.afiliado.numero_documento), datosConcurrencia = item">
                                mdi-book-open-page-variant
                            </v-icon>
                        </template>
                        <span>Seguimientos</span>
                    </v-tooltip>
                </template>

            </v-data-table>

            <v-row no-gutters>
                <v-col md="9" lg="9" xl="11" sm="11" class="px-2">
                    <v-pagination v-model="pagina" class="my-4" :length="total" :total-visible="9"
                        @input="listarConcurrencia()"></v-pagination>
                </v-col>
                <v-col md="3" lg="3" xl="1" sm="1" class="px-2" cols style="min-width: 100px">
                    <v-select class="my-4" v-model="opcionActual" :items="opciones" dense solo small
                        @change="listarConcurrencia()"></v-select>
                </v-col>
            </v-row>
        </v-card>

        <v-dialog persistent v-model="dialogs.form" fullscreen>
            <v-card>

                <v-card-title class="titulo oscuro--text mb-4">Seguimiento Concurrencia
                    <v-spacer></v-spacer>
                    <v-btn dark color="error" @click="dialogs.form = false">Cerrar</v-btn>
                </v-card-title>

                <v-tabs centered color="white" icons-and-text>
                    <v-tabs-slider color="primary"></v-tabs-slider>

                    <v-tab href="#tab-1" class="black--text">
                        Ingreso
                    </v-tab>

                    <v-tab href="#tab-2" class="black--text">
                        Seguimiento
                    </v-tab>

                    <v-tab-item :value="'tab-1'">
                        <v-card class="mx-100">
                            <v-row no-gutters>
                                <v-col cols="6" md="6">
                                    <v-container>
                                        <v-row>
                                            <AfiliadoComponent :afiliado="datos" :modoDetalle="true" :modoEdicion="true"
                                                :mostrarClasificaciones="true" />
                                        </v-row>
                                    </v-container>
                                </v-col>
                                <v-col cols="6" md="6">
                                    <v-container>
                                        <FormConcurrencia :afiliado_id="afiliado_id" :datos="datosConcurrencia"
                                            :ingresoConcurrencia="false" />
                                    </v-container>

                                </v-col>
                            </v-row>
                        </v-card>
                    </v-tab-item>

                    <v-tab-item :value="'tab-2'">
                        <v-row no-gutters>
                            <v-col cols="6" md="6">
                                <v-container>
                                    <v-row>
                                        <FormConcurrencia :afiliado_id="afiliado_id" :ingresoConcurrencia="false" />
                                    </v-row>
                                </v-container>
                            </v-col>
                            <v-col cols="5" md="5" v-if="editar == true">
                                <v-container>
                                    <v-alert dense text icon="mdi-clipboard-text-clock" type="info">
                                        <b>Historico</b>
                                    </v-alert>
                                </v-container>

                            </v-col>
                        </v-row>
                    </v-tab-item>

                </v-tabs>

                <template>
                    <div class="text-center">
                        <v-dialog v-model="preload" persistent width="300">
                            <v-card color="primary" dark>
                                <v-card-text>
                                    Tranquilo procesamos tu solicitud !
                                    <v-progress-linear indeterminate color="white" class="mb-0"></v-progress-linear>
                                </v-card-text>
                            </v-card>
                        </v-dialog>
                    </div>
                </template>

            </v-card>
        </v-dialog>

    </div>
</template>
<script>

import AfiliadoComponent from "@/components/afiliado/FormularioAfiliadoComponente.vue";
import FormConcurrencia from "@/components/concurrencia/FormConcurrencia.vue";
import AgregarPaqueteTarifaComponent from "~/components/contrato/tarifas/AgregarPaqueteTarifaComponent.vue";
import FormContratoComponent from "~/components/contrato/contratos/FormContratoComponent.vue";
import ListarDireccionamientoComponent
    from "~/components/contrato/direccionamiento/ListarDireccionamientoComponent.vue";
import ListarGeoreferenciaComponent from "~/components/contrato/georeferencia/ListarGeoreferenciaComponent.vue";
import FormTarifasComponent from "~/components/contrato/tarifas/FormTarifasComponent.vue";
import ListarManualTarifarioComponent from "~/components/contrato/manualTarifario/ListarManualTarifarioComponent.vue";
import AgregarCupsPropiosContratoComponent
    from "~/components/contrato/contratos/AgregarCupsPropiosContratoComponent.vue";
import AgregarCupsContratoComponent from "~/components/contrato/contratos/AgregarCupsContratoComponent.vue";
import ListarSalarioMinimoComponent from "~/components/contrato/salarioMinimo/ListarSalarioMinimoComponent.vue";
import FormRepsComponent from "~/components/contrato/reps/FormRepsComponent.vue";
import FormPrestadorComponent from "~/components/contrato/prestadores/FormPrestadorComponent.vue";
export default {
    middleware({ $can, redirect }) {
        if (!$can("blog.vista")) {
            return redirect("/");
        }
    },

    name: 'ListarSeguimiento',

    components: {
        FormPrestadorComponent,
        FormRepsComponent,
        ListarSalarioMinimoComponent,
        AgregarCupsContratoComponent,
        AgregarCupsPropiosContratoComponent,
        ListarManualTarifarioComponent,
        FormTarifasComponent,
        ListarGeoreferenciaComponent,
        ListarDireccionamientoComponent,
        FormContratoComponent,
        AgregarPaqueteTarifaComponent,
        AfiliadoComponent,
        FormConcurrencia,
    },

    data() {
        return {
            headers: [
                { text: "id", value: "id" },
                { text: "Entidad", value: "afiliado.entidad.nombre" },
                { text: "Afiliado", value: "afiliado", align: 'center' },
                { text: "Documento", value: "afiliado.numero_documento", align: 'center' },
                { text: "Especialidad", value: "especialidad.nombre", align: 'center' },
                { text: "Atendido en", value: "ips_atencions.nombre", align: 'center' },
                { text: "Auditor", value: "auditor_crea_personalizado", align: 'center' },
                { text: "Cie10 Ingreso", value: "cie10_ingreso.Codigo_Nombre", align: 'center' },
                { text: "Marcaciones", value: "marcacion", align: 'center' },
                { text: "Fecha Ingreso", value: "fecha_ingreso" },
                { text: "Dias Estancia", value: "dias_estancia" },
                { text: "Acciones", value: "acciones", sortable: false },
            ],
            concurrencias: [],
            datosConcurrencia: [],
            entidades: [],
            especialidades: [],
            reps: [],
            rep: null,
            preload: null,
            filtro: {
                entidad_id: null,
                documento: null,
                rep_id: null,
                ambito: null,
            },
            datos: null,
            afiliado_id: null,
            dialogs: {
                form: false,
                actualizarCups: false,
            },
            opciones: [5, 10, 15, 20, 50, 100],
            opcionActual: 15,
            pagina: 1,
            total: 0,
        };
    },

    watch: {
        rep(val) {
            if (val) {
                if (val.length > 4) {
                    this.listarReps();
                } else if (val.length < 4) {
                    this.reps = null;
                }
            } else {
                this.reps = null;
            }
        }
    },

    mounted() {
        this.listarConcurrencia();
        this.listarEntidades();
        this.listarEspecialidad();
    },

    methods: {
        listarConcurrencia() {
            this.preload = true;
            this.$axios.post('concurrencia/listar').then(res => {
                this.concurrencias = res.data;
                this.preload = false;
            }).catch(error => {
                this.preload = false;
                this.$toast.error(error.response.data.mensaje);
            })
        },

        /**
         * listar entidades
         * @return objeto entidades
         * @author kobatime
         */
        listarEntidades() {
            this.$axios.get("/entidad/listar").then((res) => {
                this.entidades = res.data;
            }).catch((error) => {
                console.log(error);
            });
        },

        listarEspecialidad() {
            this.preload = true;
            this.$axios.post('/especialidades/listar?').then(
                res => {
                    this.especialidades = res.data;
                    this.preload = false;
                }).catch(e => {
                    this.preload = false;
                })
        },

        listarReps() {
            this.preload = true;
            this.$axios.post('reps/listarConfiltro?page=0', { rep: this.rep }).then(res => {
                if (res.data.length >= 2) {
                    this.preload = false;
                    this.reps = res.data.map((rep) => {
                        return {
                            id: rep.id,
                            nombre: `${rep.nombre}`,
                        }
                    })
                } else if (res.data.length == 1) {
                    this.preload = false;
                    this.filtro.prestador_id = res.data[0].prestador_id
                    this.reps = res.data.map((rep) => {
                        return {
                            id: rep.id,
                            nombre: `${rep.nombre}`,
                        }
                    })
                }
            }).catch(e => {
                this.preload = false;
                console.log(e);
            })
        },

        semaforo(dias) {
            if (dias <= 3) {
                return "success";
            } else if (dias <= 5) {
                return "yellow";
            } else {
                return "error";
            }
        },


        buscarAfiliado(cedulaAfiliado) {
            this.preload = true;
            this.$axios.get("afiliados/" + cedulaAfiliado).then((res) => {
                this.datos = res.data;
                this.dialogs.form = true;
                this.afiliado_id = this.datos.id;
                this.preload = false;
            })
                .catch((e) => {
                    this.preload = false;
                    this.$toast.error(e.response.data.error);
                });
        },

        cerrarModalEditar() {
            this.dialogs.form = false;
        },

        limpiar() {
            this.preload = true;
            for (const prop of Object.getOwnPropertyNames(this.filtro)) {
                this.filtro[prop] = null;
            }
            this.preload = false;
            this.listarConcurrencia();
        },

        nombreCompletoAfiliado(afiliado) {
            if (!afiliado) return 'Sin Nombre';
            return [
                afiliado.primer_nombre,
                afiliado.segundo_nombre,
                afiliado.primer_apellido,
                afiliado.segundo_apellido
            ].filter(Boolean).join(' ');
        },

    },
};
</script>
