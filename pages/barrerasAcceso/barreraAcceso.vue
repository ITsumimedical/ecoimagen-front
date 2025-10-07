<template>
    <div>
        <!-- Preload -->
        <!-- <template>
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
        </template> -->

        <v-dialog persistent v-model="dialogs.formEditar" max-width="700px">
            <v-card>
                <v-card-title>
                    <v-toolbar flat>
                        <v-toolbar-title>
                            <div class="d-flex align-center">
                                <img src="/images/ojo.svg" alt="" height="50px" width="50px">
                                <span>Cerrar Barreras de Acceso</span>
                            </div>
                        </v-toolbar-title>
                        <v-divider class="mx-4" inset vertical></v-divider>
                        <v-spacer></v-spacer>
                    </v-toolbar>
                </v-card-title>
                <v-container>
                    <v-row>
                        <v-col cols="12" sm="12" md="12">
                            <v-textarea filled auto-grow label="Observación" v-model="barrera.observacion_cierre">
                            </v-textarea>
                        </v-col>
                    </v-row>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="red" small dark @click="cerrarModal()">Cerrar</v-btn>
                        <v-btn color="boton" v-if="$can('asegurador.barreraAcceso.actualizar')" small dark
                            @click="actualizarBarrera()">
                            Guardar
                        </v-btn>
                    </v-card-actions>
                </v-container>
            </v-card>
        </v-dialog>

        <v-dialog persistent v-model="dialogs.formExportar" max-width="700px">
            <v-card>
                <v-card-title>
                    <v-toolbar flat>
                        <v-toolbar-title>
                            <div class="d-flex align-center">
                                <img src="/images/ojo.svg" alt="" height="50px" width="50px">
                                <span>Exportar Barreras de Acceso</span>
                            </div>
                        </v-toolbar-title>
                        <v-divider class="mx-4" inset vertical></v-divider>
                        <v-spacer></v-spacer>
                    </v-toolbar>
                </v-card-title>
                <v-container>
                    <v-row>
                        <v-col cols="12" sm="12" md="6">
                            <v-text-field v-model="fecha.fecha_inicial" dense outlined label="Fecha inicial"
                                type="date">
                            </v-text-field>
                        </v-col>
                        <v-col cols="12" sm="12" md="6">
                            <v-text-field v-model="fecha.fecha_final" dense outlined label="Fecha inicial" type="date">
                            </v-text-field>
                        </v-col>
                    </v-row>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn small @click="cerrarModalExportar()" dark color="error">Cerrar</v-btn>
                        <v-btn small @click="reporte()" dark color="info">Descargar</v-btn>
                    </v-card-actions>
                </v-container>
            </v-card>
        </v-dialog>

        <!-- card de botones y filtros -->
        <v-card class="mx-100" elevation="0">
            <v-card-title>
                <v-toolbar flat>
                    <v-toolbar-title>
                        <div class="d-flex align-center">
                            <img src="/images/ojo.svg" alt="" height="50px" width="50px" />
                            <span>Barreras de Acceso</span>
                        </div>
                    </v-toolbar-title>
                    <v-divider class="mx-4" inset vertical></v-divider>
                </v-toolbar>
            </v-card-title>
            <div>
                <v-row class="mx-2">
                    <!-- <v-col md="2" lg="2" xl="2" sm="6" cols>
                        <pre>{{ barreaAccesos }}</pre>
                     </v-col> -->
                    <v-col md="2" lg="2" xl="2" sm="6" cols>
                        <v-text-field dense v-model="filtro.cedula_paciente" label="Numero de documento del afiliado"
                            outlined>
                        </v-text-field>
                    </v-col>

                    <v-col md="2" lg="2" xl="2" sm="6" cols>
                        <v-autocomplete dense :items="barreras" v-model="filtro.barrera" label="Barreras de acceso"
                            outlined>
                        </v-autocomplete>
                    </v-col>

                    <v-col md="3" lg="3" xl="3" sm="6" cols>
                        <v-autocomplete v-model="filtro.rep_id" label="Nombre de la sede de atención" :items="reps"
                            item-value="id" item-text="nombre" :search-input.sync="rep" outlined dense>
                        </v-autocomplete>
                    </v-col>

                    <v-col md="5" lg="5" xl="5" sm="6" cols>
                        <v-btn small color="success" @click="getBarreras()">
                            Buscar <v-icon dark right>mdi-magnify</v-icon>
                        </v-btn>
                        <v-btn small class="ml-2" color="error" @click="limpiar()">
                            Limpiar <v-icon dark right>mdi-close</v-icon>
                        </v-btn>
                        <v-btn v-if="$can('aseguramiento.barreraAcceso.exportar')" color="info"
                            class="white--text ma-2 px-6" small @click="dialogs.formExportar = true">
                            Exportar <v-icon dark right>mdi-export</v-icon>
                        </v-btn>
                    </v-col>
                </v-row>
            </div>
            <!-- tabla de cups -->
            <v-data-table :headers="headers" :items="barreaAccesos" :loading="loading.tablaBarrerasAcceso"
                loading-text="Cargando... por favor espere" hide-default-footer disable-pagination
                no-data-text="Sin datos para mostrar" dense>
                <template v-slot:[`item.afiliado`]="{ item }">
                    {{ item.afiliado ? item.afiliado.nombre_completo : "No" }}
                </template>

                <template v-slot:[`item.rep`]="{ item }">
                    {{ item.rep ? item.rep.nombre : "No" }}
                </template>

                <template v-slot:[`item.activo`]="{ item }">
                    <v-chip small dark label :color="item.activo ? 'success' : 'error'">{{ item.activo ? "Activo" : "Inactivo"
                        }}
                    </v-chip>
                </template>

                <template v-slot:[`item.created_at`]="{ item }">
                    {{ $moment(item.created_at).format("DD/MM/YYYY") }}
                </template>

                <template v-slot:[`item.acciones`]="{ item }">
                    <v-tooltip top v-if="$can('asegurador.barreraAcceso.actualizar')">
                        <template v-slot:activator="{ on, attrs }">
                            <v-icon color="warning" v-bind="attrs" v-on="on" @click="ModalEditar(item.id)">
                                mdi-close-circle-outline
                            </v-icon>
                        </template>
                        <span>Cerrar</span>
                    </v-tooltip>
                </template>
            </v-data-table>
            <v-row no-gutters>
                <v-col md="9" lg="9" xl="11" sm="11" class="px-2">
                    <v-pagination v-model="pagina" class="my-4" :length="total" :total-visible="9"
                        @input="getBarreras()">
                    </v-pagination>
                </v-col>
                <v-col md="3" lg="3" xl="1" sm="1" class="px-2" cols style="min-width: 100px">
                    <v-select class="my-4" v-model="opcionActual" :items="opciones" dense solo small
                        @change="getBarreras()">
                    </v-select>
                </v-col>
            </v-row>
        </v-card>
    </div>
</template>
<script>
import { mapActions } from 'vuex';
export default {

    middleware({ $can, redirect }) {
        if (!$can("asegurador.menu.barreraAcceso")) {
            return redirect("/");
        }
    },

    name: "barreraAcceso",

    data() {
        return {
            headers: [
                {
                    text: "Id",
                    value: "id",
                    align: 'center',
                    sortable: false,
                },
                {
                    text: "Afiliado",
                    value: "afiliado",
                    align: 'center',
                    sortable: false,
                },
                {
                    text: "Sede",
                    value: "rep",
                    align: 'center',
                    sortable: false,
                },
                {
                    text: "Barrera de acceso",
                    value: "barrera",
                    align: 'center',
                    sortable: false,
                },
                {
                    text: "Observacíon",
                    value: "observacion",
                    align: 'center',
                    sortable: false,
                },
                {
                    text: "Usuario Crea",
                    value: "user_crea.operador.nombre_completo",
                    align: 'center',
                    sortable: false,
                },
                {
                    text: "Fecha de Novedad",
                    value: "created_at",
                    align: 'center',
                    sortable: false,
                },
                {
                    text: "Estado",
                    value: "activo",
                    align: 'center',
                    sortable: false,
                },
                {
                    text: "Acciones",
                    value: "acciones",
                    sortable: false,
                    align: 'center',
                },
            ],
            barreras: [
                "Físicas",
                "Administrativas",
                "Comunicación",
                "Económicas",
                "Tecnológicas",
                "Talento Humano",
                "Distribución Geográfica",
                "Reputacional",
            ],
            checkbox_Afiliado: false,
            checkbox_sede: false,
            filtro: {
                barrera: null,
                cedula_paciente: null,
                rep_id: null,
            },
            fecha: {
                fecha_inicial: "",
                fecha_final: "",
            },
            barreraAcceso_id: null,
            barreaAccesos: [],
            barrera: {
                barreaAcceso: null,
                cedula_paciente: null,
                observacion: null,
                ips_atencion: null,
                observacion_cierre: null,
            },
            dialogs: {
                formEditar: false,
                formExportar: false,
            },
            reps: null,
            preload: false,
            rep: null,
            pagina: 1,
            total: 0,
            opcionActual: 10,
            opciones: [5, 10, 20, 50, 100],
            loading: { tablaBarrerasAcceso: false },
        };
    },

    mounted() {
        this.getBarreras();
    },

    watch: {
        rep(val) {
            if (val) {
                if (val.length === 4) {
                    this.listarReps();
                } else if (val.length < 4) {
                    this.reps = null;
                }
            } else {
                this.reps = null;
            }
        },
    },

    methods: {
        ...mapActions('app', ['setPreload']),
        listarReps() {
            this.setPreload(true);
            this.$axios
                .post("reps/listarConfiltro?page=0", {
                    rep: this.rep,
                })
                .then((res) => {
                    if (res.data.length >= 2) {
                        this.setPreload(false);
                        this.reps = res.data.map((rep) => {
                            return {
                                id: rep.id,
                                nombre: `${rep.nombre}`,
                            };
                        });
                    } else if (res.data.length == 1) {
                        this.setPreload(false);
                        this.filtro.prestador_id = res.data[0].prestador_id;
                        this.reps = res.data.map((rep) => {
                            return {
                                id: rep.id,
                                nombre: `${rep.nombre}`,
                            };
                        });
                    }
                })
                .catch((e) => {
                    this.setPreload(false);
                    console.log(e);
                });
        },

        getBarreras() {
            this.loading.tablaBarrerasAcceso = true;
            this.$axios
                .post(
                    "/barrera-acceso/listar?page=" +
                    this.pagina +
                    "&cant=" +
                    this.opcionActual,
                    this.filtro
                )
                .then((res) => {
                    this.barreaAccesos = res.data.data;
                    this.$toast.error(res.data.mensaje);
                    this.total = res.data.last_page;
                })
                .catch((e) => {
                    this.$toast.error(e.response.data.error);
                })
                .finally(() => {
                    this.loading.tablaBarrerasAcceso = false;
                });
        },

        ModalEditar(item) {
            this.dialogs.formEditar = true;
            this.barreraAcceso_id = item;
        },

        cerrarModal() {
            this.dialogs.formEditar = false;
            this.barreraAcceso_id = null;
            this.barrera.observacion_cierre = "";
        },

        actualizarBarrera() {
            this.setPreload(true);
            this.$axios
                .put(
                    "/barrera-acceso/actualizar/" + this.barreraAcceso_id,
                    this.barrera
                )
                .then((res) => {
                    this.$toast.success(res.data.mensaje);
                    this.cerrarModal();
                    this.getBarreras();
                    this.barrera.observacion_cierre = "";
                    this.setPreload(false);
                })
                .catch((e) => {
                    this.setPreload(false);
                    this.$toast.error(e.response.data.error);
                });
        },

        reporte() {
            this.setPreload(true);
            this.$axios({
                method: "post",
                params: {
                    fecha_inicial: this.fecha.fecha_inicial,
                    fecha_final: this.fecha.fecha_final,
                },
                url: "/barrera-acceso/reporte",
                responseType: "blob",
            })
                .then((res) => {
                    this.setPreload(false);
                    let blob = new Blob([res.data], {
                        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8",
                    });
                    let url = window.URL.createObjectURL(blob);
                    let a = document.createElement("a");

                    a.download = "InformeBarreraAcceso.xlsx";
                    a.href = url;
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    this.cerrarModalExportar();
                })
                .catch((err) => {
                    this.setPreload(false);
                    this.$toast.error('Error en descargar informe');
                });
        },

        cerrarModalExportar() {
            for (const key in this.fecha) {
                this.fecha[key] = "";
            }
            this.dialogs.formExportar = false;
        },

        limpiar() {
            for (const key in this.filtro) {
                this.filtro[key] = null;
            }
            this.setPreload(false);
            this.getBarreras();
        },
    },
};
</script>
