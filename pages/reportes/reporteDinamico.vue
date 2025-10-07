<template>
    <v-card elevation="0">
        <v-card-title>
            <v-toolbar flat>
                <v-toolbar-title>
                    <div class="d-flex align-center">
                        <img src="/images/ojo.svg" alt="" height="50px" width="50px" />
                        <span>Generar reporte</span>
                    </div>
                </v-toolbar-title>
                <v-divider class="mx-4" inset vertical></v-divider>
            </v-toolbar>
        </v-card-title>
        <v-card>
            <v-card-text flat>
                <v-row>
                    <v-col cols="12" sm="6" md="6">
                        <v-select v-model="form.reporteId" :items="reportes" item-text="nombre" item-value="id"
                            label="Seleccionar Reporte" outlined dense required
                            @change="listarCampos(form.reporteId)" />
                    </v-col>
                </v-row>

                <v-divider class="my-4"></v-divider>

                <v-row>
                    <div v-if="camposReporte.length > 0" v-for="(campo, index) in camposReporte" :key="index">
                        <v-col cols="12" v-if="campo.tipo === 'text'">
                            <v-text-field :label="campo.nombre" v-model="campo.valor" outlined dense required />
                        </v-col>
                        <v-col cols="12" v-if="campo.tipo === 'select'">
                            <v-select :label="campo.nombre"
                                :items="campo.opciones.map(option => ({ text: option.nombre, value: option.id }))"
                                v-model="campo.valor" item-text="text" item-value="value" outlined dense required />
                        </v-col>
                        <v-col cols="12" v-if="campo.tipo === 'checkbox'">
                            <v-checkbox :label="campo.nombre" v-model="campo.valor" dense />
                        </v-col>
                        <v-col cols="12" v-if="campo.tipo === 'date'">
                            <v-menu v-model="campo.menu" :close-on-content-click="false" transition="scale-transition"
                                offset-y min-width="auto">
                                <template v-slot:activator="{ on, attrs }">
                                    <v-text-field v-model="campo.valor" :label="campo.nombre" readonly v-bind="attrs"
                                        v-on="on" outlined dense required />
                                </template>
                                <v-date-picker v-model="campo.valor" @input="validarFechas(campo)" />
                            </v-menu>
                        </v-col>
                    </div>
                </v-row>
            </v-card-text>

            <v-card-actions>
                <v-row dense>
                    <v-col cols="12" sm="12" md="12" class="my-4">
                        <v-divider></v-divider>
                    </v-col>
                    <v-col cols="12" sm="12" md="12" class="text-right">
                        <v-btn :loading="loading" color="success" @click="generarReporte">
                            Generar Reporte
                        </v-btn>
                    </v-col>
                </v-row>
            </v-card-actions>
        </v-card>
    </v-card>
</template>

<script>
import axios from 'axios';
export default {
    data: () => ({
        form: {
            reporteId: null
        },
        reportes: [],
        camposReporte: [],
        loading: false,
        urlBase: "http://localhost:8001/reporte",
        API_TOKEN:
            "aS0CPpHixeJbda60EHXF1BLEc2cmB4P29AEgbi2dV1WAjgPb7UDMSjN0UJhQuZ4ixZHjekHhq0LW3czwPt1B1t4JJNHLfeZujyCA",
    }),
    methods: {
        obtenerReportes() {
            this.$axios
                .get('/reportes/configuracion-reportes')
                .then((response) => {
                    this.reportes = response.data.data;
                })
                .catch(() => {
                    this.$toast.error('Error al cargar los reportes');
                });
        },
        listarCampos(id) {
            this.loading = true;
            this.$axios
                .get(`/reportes/configuracion-reportes/${id}/campos`)
                .then((response) => {
                    if (response.data.campos.length > 0) {
                        this.camposReporte = response.data.campos.map((campo) => {
                            const campoConfigurado = {
                                nombre: campo.nombre,
                                tipo: campo.tipoCampo,
                                valor: campo.valorDefault || '',
                                opciones: Array.isArray(campo.opciones) ? campo.opciones : [],
                                menu: false
                            };

                            if (campo.tipoCampo === 'select' && campo.origen) {
                                this.$axios
                                    .get(campo.origen)
                                    .then((response) => {
                                        let data = response.data;

                                        // Verificar si la respuesta tiene datos quemados
                                        if (Array.isArray(data) && data.length > 0 && data[0].original) {
                                            data = data[0].original;
                                        }

                                        campoConfigurado.opciones = Array.isArray(data) ? data : [];
                                    })
                                    .catch((error) => {
                                        console.error('Error al cargar las opciones del select:', error);
                                        this.$toast.error('Error al cargar las opciones del select');
                                    });
                            }

                            return campoConfigurado;
                        });
                    } else {
                        this.$toast.error('No se encontraron campos para este reporte');
                    }
                })
                .catch((error) => {
                    console.error('Error:', error);
                    this.$toast.error('Error al cargar los campos del reporte');
                })
                .finally(() => {
                    this.loading = false;
                });
        },

        validarFechas(campoActual) {
            const fechaInicial = this.camposReporte.find(campo => campo.nombre === 'fecha_inicial');
            const fechaFinal = this.camposReporte.find(campo => campo.nombre === 'fecha_final');

            if (fechaInicial && fechaFinal && fechaInicial.valor && fechaFinal.valor) {
                const fechaInicialDate = new Date(fechaInicial.valor);
                const fechaFinalDate = new Date(fechaFinal.valor);

                if (fechaFinalDate < fechaInicialDate) {
                    this.$toast.error('La fecha final debe ser posterior a la fecha inicial');
                    campoActual.valor = '';
                }
            }
        },
        async generarReporte() {
            this.loading = true;
            const reporteSeleccionado = this.reportes.find(reporte => reporte.id === this.form.reporteId);
            const urlDestino = `${this.urlBase}/${reporteSeleccionado.url}?token=${this.API_TOKEN}`;

            try {
                const response = await axios.post(urlDestino, {
                    url: reporteSeleccionado.url,
                    parametros: this.camposReporte.map(campo => campo.valor)
                }, {
                    timeout: 300000,
                    responseType: 'arraybuffer',
                });

                const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
                const enlace = document.createElement('a');
                enlace.href = URL.createObjectURL(blob);
                enlace.download = 'reporte.xlsx';
                enlace.click();
            } catch (err) {
                this.$toast.error('Error al generar el reporte.');
                console.error(err);
            } finally {
                this.loading = false;
            }
        }
    },
    mounted() {
        this.obtenerReportes();
    }
};
</script>
