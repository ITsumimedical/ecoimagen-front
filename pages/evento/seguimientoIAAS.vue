<template>
    <v-card elevation="0">
        <v-card-title>
            <v-toolbar flat>
                <v-toolbar-title class="d-flex align-center">
                    <img src="/images/ojo.svg" alt="" height="50px" width="50px" />
                    <v-divider vertical class="mx-3"></v-divider>
                    <span class="ml-2 font-weight-bold">
                        Seguimiento Infecciones asociadas al cuidado de la salud (IAAS)
                    </span>
                </v-toolbar-title>
                <v-spacer></v-spacer>
            </v-toolbar>
        </v-card-title>

        <v-card-text>
            <v-row dense>
                <v-col cols="12" sm="4" md="3">
                    <v-select v-model="filtros.mes" :items="meses" label="Mes" outlined dense />
                </v-col>
                <v-col cols="12" sm="4" md="3">
                    <v-select v-model="filtros.anio" :items="anios" label="Año" outlined dense />
                </v-col>
                <v-col cols="12" sm="4" md="3" class="d-flex align-start mt-2">
                    <v-btn color="info" small @click="consultarSeguimiento" :loading="loading">
                        <v-icon left small>mdi-magnify</v-icon>Consultar
                    </v-btn>
                     <v-btn color="success" small class="ml-1" @click="descargarExcel" :loading="loadingExcel">
                    <v-icon left small>mdi-file-excel</v-icon>
                    Descargar Excel
                </v-btn>
                </v-col>
            </v-row>
        </v-card-text>

        <v-card v-if="afiliados.length > 0" elevation="0">
            <v-col cols="12" sm="6" md="6">
                <v-text-field v-model="busqueda" label="Buscar afiliado" prepend-inner-icon="mdi-magnify" outlined dense
                    hint="Puede filtrar por cualquier campo de la tabla" clearable class="mb-4"></v-text-field>
            </v-col>

            <v-data-table dense :headers="headers" :items="afiliados" :loading="loading" no-data-text="No hay registros"
                :search="busqueda" loading-text="Cargando...">
                <template v-slot:[`item.acciones`]="{ item }">
                    <v-tooltip bottom>
                        <template v-slot:activator="{ props, on }">
                            <v-btn icon v-on="on" v-bind="props" @click="verDetalle(item)">
                                <v-icon color="info" small>mdi-eye</v-icon>
                            </v-btn>
                        </template>
                        <span>Ver detalle</span>
                    </v-tooltip>
                </template>
            </v-data-table>
        </v-card>

        <v-dialog v-model="modalDetalle" max-width="900px">
            <v-card>
                <v-card-title class="d-flex align-center justify-space-between">
                    <div class="d-flex align-center">
                        <v-icon class="mr-2" color="primary">mdi-file-document-box</v-icon>
                        <span class="font-weight-bold text-h6">Detalle del Afiliado</span>
                    </div>
                    <v-btn icon @click="modalDetalle = false">
                        <v-icon>mdi-close</v-icon>
                    </v-btn>
                </v-card-title>

                <v-card-text>
                    <v-card flat class="mb-4">
                        <v-card-text>
                            <v-sheet class="pa-4" rounded elevation="1">
                                <v-row dense>
                                    <v-col cols="12" sm="6" md="4" class="d-flex align-center mb-2">
                                        <v-icon color="primary" class="mr-2">mdi-account-circle</v-icon>
                                        <div>
                                            <div class="text-caption text--secondary">Nombre</div>
                                            <div class="font-weight-medium">{{ detalleAfiliado?.afiliado_nombre }}</div>
                                        </div>
                                    </v-col>

                                    <v-col cols="12" sm="6" md="4" class="d-flex align-center mb-2">
                                        <v-icon color="primary" class="mr-2">mdi-card-account-details</v-icon>
                                        <div>
                                            <div class="text-caption text--secondary">Documento</div>
                                            <div class="font-weight-medium">{{ detalleAfiliado?.afiliado_documento }}
                                            </div>
                                        </div>
                                    </v-col>

                                    <v-col cols="12" sm="6" md="4" class="d-flex align-center mb-2">
                                        <v-icon color="primary" class="mr-2">mdi-phone-classic</v-icon>
                                        <div>
                                            <div class="text-caption text--secondary">Teléfono</div>
                                            <div class="font-weight-medium">
                                                {{ detalleAfiliado?.telefono }}
                                            </div>
                                        </div>
                                    </v-col>


                                    <v-col cols="12" sm="6" md="4" class="d-flex align-center mb-2">
                                        <v-icon color="primary" class="mr-2">mdi-cellphone</v-icon>
                                        <div>
                                            <div class="text-caption text--secondary">Celular</div>
                                            <div class="font-weight-medium">
                                                {{ detalleAfiliado?.celular1 }} | {{ detalleAfiliado?.celular2 }}
                                            </div>
                                        </div>
                                    </v-col>

                                    <v-col cols="12" sm="6" md="4" class="d-flex align-center mb-2">
                                        <v-icon color="primary" class="mr-2">mdi-email</v-icon>
                                        <div>
                                            <div class="text-caption text--secondary">Correo</div>
                                            <div class="font-weight-medium">
                                                {{ detalleAfiliado?.correo1 || detalleAfiliado?.correo2 }}
                                            </div>
                                        </div>
                                    </v-col>

                                    <v-col cols="12" sm="6" md="4" class="d-flex align-center mb-2">
                                        <v-icon color="primary" class="mr-2">mdi-map-marker</v-icon>
                                        <div>
                                            <div class="text-caption text--secondary">Dirección</div>
                                            <div class="font-weight-medium">{{ detalleAfiliado?.direccion }}</div>
                                        </div>
                                    </v-col>
                                </v-row>
                            </v-sheet>
                        </v-card-text>

                    </v-card>

                    <v-card flat>
                        <v-card-title class="font-weight-bold grey--text text--darken-2">
                            Atenciones en el mes
                        </v-card-title>
                        <v-divider></v-divider>
                        <v-card-text>
                            <v-row dense>
                                <v-col v-for="(atencion, index) in detalleAfiliado?.atenciones || []" :key="index"
                                    cols="12" sm="6" md="4">
                                    <v-sheet :color="atencion.origen === 'ACS' ? 'blue lighten-5' : 'pink lighten-5'"
                                        rounded elevation="2" class="pa-3">
                                        <v-row no-gutters align="center">
                                            <v-col cols="auto">
                                                <v-icon
                                                    :color="atencion.origen === 'ACS' ? 'blue darken-1' : 'pink darken-1'">
                                                    {{ atencion.origen === 'ACS' ? 'mdi-stethoscope' : 'mdi-hospital' }}
                                                </v-icon>
                                            </v-col>
                                            <v-col>
                                                <div class="font-weight-bold">{{ atencion.codigo_cups }} - {{
                                                    atencion.nombre_cups }}</div>
                                                <div class="text--secondary text-caption">
                                                    {{ formatFecha(atencion?.fecha_atencion) }} | {{
                                                        atencion?.nombre_diagnostico
                                                    }} {{ atencion?.codigo_diagnostico }}
                                                </div>
                                                <div class="mt-1">
                                                    <v-chip small
                                                        :color="atencion.origen === 'ACS' ? 'blue lighten-3' : 'pink lighten-3'"
                                                        text-color="black">
                                                        {{ atencion?.origen }}
                                                    </v-chip>
                                                </div>
                                            </v-col>
                                        </v-row>
                                    </v-sheet>
                                </v-col>
                            </v-row>
                        </v-card-text>
                    </v-card>
                </v-card-text>
            </v-card>
        </v-dialog>

    </v-card>
</template>

<script>
import moment from "moment";

export default {
    data() {

        return {
            filtros: {
                mes: moment().month() + 1,
                anio: moment().year(),
            },
            meses: moment.months().map((m, i) => ({ text: m, value: i + 1 })),
            anios: Array.from({ length: 5 }, (_, i) => moment().year() - i),
            headers: [
                { text: "Nombre", value: "afiliado_nombre" },
                { text: "Documento", value: "afiliado_documento" },
                { text: "Teléfono", value: "telefono" },
                { text: "Celular", value: "celular1" },
                { text: "Correo", value: "correo1" },
                { text: "Acciones", value: "acciones", sortable: false },
            ],
            afiliados: [],
            detalleAfiliado: null,
            modalDetalle: false,
            loading: false,
            busqueda: "",
            loadingExcel: false,
        };
    },

    methods: {
        async consultarSeguimiento() {
            this.loading = true;
            try {
                const res = await this.$axios.post("/eventos-adversos/listar-seguimiento-iaas", this.filtros);

                const grouped = res.data.reduce((acc, item) => {
                    const key = item.afiliado_documento;
                    if (!acc[key]) {
                        acc[key] = { ...item, atenciones: [] };
                    }
                    acc[key].atenciones.push(item);
                    return acc;
                }, {});
                this.afiliados = Object.values(grouped);
            } catch (error) {
                this.$toast.error("Error al cargar los datos");
            } finally {
                this.loading = false;
            }
        },

        verDetalle(item) {
            this.detalleAfiliado = item;
            this.modalDetalle = true;
        },

        formatFecha(fecha) {
            return fecha ? moment(fecha).format("DD/MM/YYYY") : "-";
        },

        async descargarExcel() {
            this.loadingExcel = true;
            try {
                const response = await this.$axios.post(
                    "/eventos-adversos/descargar-seguimiento-iaas",
                    this.filtros,
                    { responseType: "blob" }
                );

                const blob = new Blob([response.data], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
                const url = window.URL.createObjectURL(blob);

                const link = document.createElement("a");
                link.href = url;

                const mes = this.filtros.mes.toString().padStart(2, "0");
                const anio = this.filtros.anio;
                link.setAttribute("download", `Seguimiento_IAAS_${mes}_${anio}.xlsx`);

                document.body.appendChild(link);
                link.click();
                link.remove();

                window.URL.revokeObjectURL(url);
            } catch (error) {
                this.$toast.error("Error al descargar el Excel");
            } finally {
                this.loadingExcel = false;
            }
        }

    },
};
</script>
