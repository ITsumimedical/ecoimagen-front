<template>
    <div>
        <v-card elevation="0">
            <v-card-title>
                <v-toolbar flat>
                    <v-toolbar-title>
                        <div class="d-flex align-center">
                            <img src="/images/ojo.svg" alt="" height="50px" width="50px">
                            <span>Reportes</span>
                        </div>
                    </v-toolbar-title>
                    <v-divider class="mx-4" inset vertical></v-divider>
                    <v-spacer></v-spacer>
                </v-toolbar>
            </v-card-title>
            <v-card-text>
                <v-row>
                    <v-col cols="12" sm="12" md="12">
                        <v-select dense outlined :items="reportesPorPermisos" v-model="dataReporte"
                            item-text="nombre_reporte" item-value="id_reporte" return-object
                            label="Seleccione el reporte que desea generar." @change="tipoReporteSeleccionado()">
                        </v-select>
                    </v-col>
                </v-row>
                <v-row v-if="camposReporte">
                    <v-col cols="12" sm="12" md="4" v-for="(parametro, index) in camposReporte" :key="index">
                        <v-text-field dense outlined v-if="parametro.tipo_dato === 'string'" v-model="parametro.valor"
                            :label="parametro.nombre_parametro">
                        </v-text-field>
                        <v-text-field dense outlined v-if="parametro.tipo_dato === 'int'" v-model="parametro.valor"
                            :label="parametro.nombre_parametro" type="number">
                        </v-text-field>

                        <v-text-field dense outlined v-else-if="parametro.tipo_dato === 'date'"
                            v-model="parametro.valor" :label="parametro.nombre_parametro" type="date">
                        </v-text-field>

                        <v-select dense outlined v-else-if="parametro.tipo_dato === 'select'" v-model="parametro.valor"
                            :label="parametro.nombre_parametro" :items="nombre || []" item-text="nombre" item-value="id"
                            @focus="cargarOpcionesSelect(parametro)"></v-select>
                    </v-col>
                </v-row>
                <v-card-actions>
                    <v-btn block dark color="primary" @click="generarReporte()">
                        generar reporte
                        <v-icon dark right>
                            mdi-cloud-download
                        </v-icon>
                    </v-btn>
                </v-card-actions>

            </v-card-text>
        </v-card>
    </div>
</template>

<script>
    import {
        mapActions
    } from "vuex";
    import {
        convertirJsonAMatriz,
        crearExcel
    } from "~/utils/excel";

    export default {
        middleware({
            $can,
            redirect
        }) {
            if (!$can('reportes.vista')) {
                return redirect('/');
            }
        },

        data() {
            return {
                reportes: [],
                dataReporte: null,
                camposReporte: null,
                nombre: null,
                form: {
                    nombre: ''
                },
                reportesPorPermisos: [],
                apiReportesToken: this.$config.API_REPORTES_TOKEN,
                apiReportesURL: this.$config.API_REPORTES_URL
            };
        },

        created() {
            this.obtenerReportesParametrizados();
        },

        methods: {
            ...mapActions('app', ['setPreload']),

            obtenerReportesParametrizados() {
                try {
                    this.$axios.get('/reportes/obtener-reportes').then(res => {
                        const allReports = res.data;
                        const userPermissions = this.$store.state.auth.usuario.permissions;
                        this.reportesPorPermisos = allReports.filter(reporte => userPermissions.includes(reporte
                            .nombre_permiso))
                        if (this.reportesPorPermisos.length === 0) {
                            this.$toast.info('No tienes permisos para ver ningún reporte.');
                        }
                    });
                } catch (error) {
                    this.$toast.error('Error al actualizar las rutas');
                }
            },

            async generarReporte() {
                let report = {
                    nombre_procedimiento: this.dataReporte.nombre_procedimiento,
                    parametros: this.camposReporte.map(parametro => ({
                        nombre_parametro: parametro.nombre_parametro,
                        valor: parametro.valor,
                        orden_parametro: parseInt(parametro.orden_parametro)
                    }))
                };

                const parametroInvalido = report.parametros.some(parametro => !parametro.valor);

                if (parametroInvalido) {
                    this.$toast.error('Selecciona todos los parámetros');
                    return;
                }


                try {

                    this.setPreload(true);
                    const {
                        data
                    } = await this.$axios.post(
                        `${this.apiReportesURL}/generar-reporte?token=${this.apiReportesToken}`, report);

                    const matrizDatos = convertirJsonAMatriz(data);

                    crearExcel(matrizDatos, `${this.dataReporte.nombre_reporte}.xlsx`);

                    this.$toast.success('Reporte generado con éxito');

                } catch (error) {
                    console.log(error);
                    this.$toast.error(error.response && error.response.data && error.response.data.message ? error.response.data.message : 'Error al generar el reporte');
                } finally {
                    this.setPreload(false);
                }

            },

            tipoReporteSeleccionado() {
                if (this.dataReporte && this.dataReporte.detalles) {
                    this.camposReporte = this.dataReporte.detalles.map(parametro => ({
                        ...parametro,
                        valor: null
                    }));
                }
            },

            async cargarOpcionesSelect(parametro) {
                let url = parametro.origen.replace("api", "")

                if (parametro.opciones && parametro.opciones.length > 0) return;

                try {

                    const response = await this.$axios.get(url);

                    this.nombre = response.data;

                } catch (error) {
                    console.log('Error de opciones', error)
                    this.$toast.error('Error al cargar las opciones');
                }
            },
        },
    };

</script>
