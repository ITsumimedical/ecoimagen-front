<template>
    <div>
        <v-card elevation="0">
            <v-card-title>
                <v-toolbar flat>
                    <v-toolbar-title>
                        <div class="d-flex align-center">
                            <img src="/images/ojo.svg" alt="" height="50px" width="50px">
                            <span>Parametrización - Reportes</span>
                        </div>
                    </v-toolbar-title>
                    <v-divider class="mx-4" inset vertical></v-divider>
                    <v-spacer></v-spacer>
                </v-toolbar>
            </v-card-title>

            <v-card-text>
                <v-row dense>
                    <v-col cols="12" sm="12" md="12" align="right">
                        <v-btn v-if="$can('crear.reporte')" color="success" small dark
                            @click="dialogoFormReporte = true">
                            Crear
                            <v-icon dark right>
                                mdi-plus-circle-outline
                            </v-icon>
                        </v-btn>
                        <v-btn v-if="$can('crear.reporte')" small :loading="loading" :disabled="loading" color="warning"
                            @click="registroRutas()">
                            Actualizar Rutas
                        </v-btn>
                    </v-col>
                </v-row>

                <v-row dense>
                    <v-col cols="12" sm="12" md="12">
                        <v-data-table :headers="headers" :items="reportes" item-key="id" class="elevation-1">
                            <template v-slot:item="{ item }">
                                <tr @click="toggleAccordion(item.id)" class="clickable-row">
                                    <td>{{ item.nombre_reporte }}</td>
                                    <td>{{ item.nombre_procedimiento }}</td>
                                    <td>{{ item.estado ? 'Activo' : 'Inactivo' }}</td>
                                    <td>
                                        <v-icon color="success">
                                            {{ expanded.includes(item.id) ? 'mdi-chevron-up' : 'mdi-chevron-down' }}
                                        </v-icon>
                                    </td>
                                </tr>
                                <tr v-if="expanded.includes(item.id)">
                                    <td colspan="4">
                                        <v-row v-for="(detalle, index) in item.detalles" :key="detalle.id"
                                            class="detail-row" style="margin-top: 3px;margin-bottom: -22px;">
                                            <v-col cols="2" sm="2" md="2">
                                                <v-text-field v-model="detalle.nombre_parametro"
                                                    :label="`Nombre ${index + 1}`" outlined dense readonly>
                                                </v-text-field>
                                            </v-col>
                                            <v-col cols="2">
                                                <v-text-field v-model="detalle.orden_parametro"
                                                    :label="`Orden ${index + 1}`" outlined dense readonly>
                                                </v-text-field>
                                            </v-col>
                                            <v-col cols="2">
                                                <v-text-field v-model="detalle.tipo_dato"
                                                    :label="`Tipo dato ${index + 1}`" outlined dense readonly>
                                                </v-text-field>
                                            </v-col>
                                            <v-col cols="2" v-if="detalle.origen">
                                                <v-text-field v-model="detalle.origen" :label="`Origen ${index + 1}`"
                                                    outlined dense readonly></v-text-field>
                                            </v-col>
                                            <v-col cols="2" v-if="detalle.origen">
                                                <v-text-field v-model="detalle.nombre_columna_bd"
                                                    :label="`nombre columna bd ${index + 1}`" outlined dense readonly>
                                                </v-text-field>
                                            </v-col>
                                            <v-col cols="2" v-if="detalle.origen">
                                                <v-text-field v-model="detalle.valor_columna_guardar"
                                                    :label="`valor columna bd ${index + 1}`" outlined dense readonly>
                                                </v-text-field>
                                            </v-col>
                                        </v-row>
                                    </td>
                                </tr>
                            </template>
                        </v-data-table>
                    </v-col>
                </v-row>
            </v-card-text>
        </v-card>
        <v-col cols="auto">
            <v-dialog v-model="dialogoFormReporte" persistent transition="dialog-top-transition" max-width="1100">
                <template>
                    <v-card>
                        <v-alert dense type="info">Parametrización de nuevo reporte</v-alert>
                        <v-card-text>
                            <v-row>
                                <v-col cols="12" sm="6" md="5">
                                    <v-text-field v-model="formReporte.nombre_reporte" label="Nombre reporte" outlined
                                        dense>
                                    </v-text-field>
                                </v-col>
                                <v-col cols="12" sm="6" md="5">
                                    <v-text-field v-model="formReporte.nombre_procedimiento"
                                        label="Nombre de la funcion" outlined dense>
                                    </v-text-field>
                                </v-col>
                                <v-col cols="12" sm="6" md="2">
                                    <v-btn class="mx-2" fab small dark color="warning"
                                        @click="addParametrosAlReporte()">
                                        <v-icon dark>
                                            mdi-plus
                                        </v-icon>
                                    </v-btn>
                                </v-col>
                                <template v-if="parametrosReporte == true">
                                    <v-col cols="12" sm="12" md="12">
                                        <v-alert dense icon="mdi-code-not-equal-variant" type="success">Datos de los
                                            parametros asociados al procedimiento
                                            <b>{{ formReporte.nombre_procedimiento }}</b></v-alert>
                                    </v-col>
                                    <v-col cols="12" sm="12" md="12">
                                        <v-row>
                                            <v-col v-for="(parametro, index) in addParametros" :key="index" cols="12"
                                                sm="12" md="12">
                                                <v-row>
                                                    <v-col cols="3">
                                                        <v-text-field v-model="parametro.nombre_parametro"
                                                            :label="`Nombre ${index + 1}`" outlined dense readonly>
                                                        </v-text-field>
                                                    </v-col>
                                                    <v-col cols="2">
                                                        <v-text-field v-model="parametro.orden_parametro"
                                                            :label="`Orden ${index + 1}`" outlined dense readonly>
                                                        </v-text-field>
                                                    </v-col>
                                                    <v-col cols="3">
                                                        <v-text-field v-model="parametro.tipo_dato"
                                                            :label="`Tipo dato ${index + 1}`" outlined dense readonly>
                                                        </v-text-field>
                                                    </v-col>
                                                    <v-col cols="3" v-if="parametro.tipo_dato == 'select'">
                                                        <v-text-field v-model="parametro.origen"
                                                            :label="`Origen ${index + 1}`" outlined dense readonly>
                                                        </v-text-field>
                                                    </v-col>
                                                    <v-col cols="3" v-if="parametro.tipo_dato == 'select'">
                                                        <v-text-field v-model="parametro.nombre_columna_bd"
                                                            :label="`nombre columna bd ${index + 1}`" outlined dense
                                                            readonly>
                                                        </v-text-field>
                                                    </v-col>
                                                    <v-col cols="3" v-if="parametro.tipo_dato == 'select'">
                                                        <v-text-field v-model="parametro.valor_columna_guardar"
                                                            :label="`valor columna bd ${index + 1}`" outlined dense
                                                            readonly>
                                                        </v-text-field>
                                                    </v-col>
                                                </v-row>
                                            </v-col>
                                        </v-row>
                                    </v-col>
                                    <v-col cols="12" sm="6" md="2">
                                        <v-text-field v-model="formReporte.nombre_parametro" label="Nombre" outlined
                                            dense>
                                        </v-text-field>
                                    </v-col>
                                    <v-col cols="12" sm="6" md="2">
                                        <v-select v-model="formReporte.orden_parametro"
                                            :items="ordenParametrosDisponibles" label="Orden" outlined dense>
                                        </v-select>
                                    </v-col>
                                    <v-col cols="12" sm="6" md="2">
                                        <v-select v-model="formReporte.tipo_dato" :items="tipoDatos"
                                            @change="cambioTipoDato()" label="Tipo dato" outlined dense>
                                        </v-select>
                                    </v-col>
                                    <v-col cols="12" sm="6" md="4" v-if="formReporte.tipo_dato == 'select'">
                                        <v-autocomplete v-model="formReporte.origen" :items="rutas" item-text="url"
                                            label="Origen" outlined dense>
                                        </v-autocomplete>
                                    </v-col>
                                    <v-col cols="12" sm="6" md="2">
                                        <v-btn class="mx-2" fab small dark color="warning" @click="addParametro()">
                                            <v-icon dark>
                                                mdi-plus
                                            </v-icon>
                                        </v-btn>
                                    </v-col>
                                    <v-col cols="12" sm="3" md="3" v-if="formReporte.tipo_dato == 'select'">
                                        <v-text-field v-model="formReporte.nombre_columna_bd" label="nombre parametro"
                                            outlined dense>
                                        </v-text-field>
                                    </v-col>
                                    <v-col cols="12" sm="3" md="3" v-if="formReporte.tipo_dato == 'select'">
                                        <v-text-field v-model="formReporte.valor_columna_guardar"
                                            label="valor parametro" outlined dense>
                                        </v-text-field>
                                    </v-col>
                                </template>
                            </v-row>
                        </v-card-text>
                        <v-card-actions class="justify-end">
                            <v-btn color="error" small @click="cancelarReporte()">Cancelar</v-btn>
                            <v-btn color="success" small @click="crearReporte()">Crear</v-btn>
                        </v-card-actions>
                    </v-card>
                </template>
            </v-dialog>
        </v-col>
    </div>
</template>

<script>
    import {
        mapActions
    } from "vuex";

    export default {

        middleware({
            $can,
            redirect
        }) {
            if (!$can('crear.reporte')) {
                return redirect('/');
            }
        },
        data() {
            return {
                expanded: [],
                reportes: [],
                rutas: [],
                addParametros: [],
                buscar: null,
                loading: false,
                parametrosReporte: false,
                dialogoFormReporte: false,
                misEndpoint: [],
                formReporte: {
                    nombre_reporte: '',
                    nombre_procedimiento: '',
                    nombre_parametro: '',
                    orden_parametro: '',
                    tipo_dato: '',
                    origen: '',
                    nombre_columna_bd: '',
                    valor_columna_guardar: ''
                },
                ordenParametros: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
                tipoDatos: ['string', 'select', 'int', 'date'],
                headers: [{
                        text: 'Nombre reporte',
                        sortable: false,
                    },
                    {
                        text: 'Nombre funcion',
                        sortable: false,
                    },
                    {
                        text: 'Estado',
                        sortable: false,
                    },
                    {
                        text: 'accion',
                        sortable: false,
                    },
                ],
            };
        },

        computed: {
            ordenParametrosDisponibles() {
                const ordenesUsados = this.addParametros.map(param => param.orden_parametro);
                return this.ordenParametros.filter(orden => !ordenesUsados.includes(orden));
            }
        },

        created() {
            this.obtenerEndPoint();
            this.obtenerReportesParametrizados();
        },

        methods: {
            ...mapActions("app", ["setPreload"]),

            addParametrosAlReporte() {
                if (this.formReporte.nombre_reporte && this.formReporte.nombre_procedimiento) {
                    this.parametrosReporte = true;
                }
            },

            cambioTipoDato() {
                this.formReporte.origen = '';
            },

            crearReporte() {
                this.setPreload(true);
                try {
                    const payload = {
                        nombre_reporte: this.formReporte.nombre_reporte,
                        nombre_procedimiento: this.formReporte.nombre_procedimiento,
                        parametros: this.addParametros
                    };

                    this.$axios.post('/reportes/crear-reporte', payload).then(res => {
                        this.dialogoFormReporte = false;
                        this.$toast.success('Reporte creado con éxito');
                        this.obtenerReportesParametrizados();
                        this.formReporte = {
                            nombre_reporte: '',
                            nombre_procedimiento: '',
                            nombre_parametro: '',
                            orden_parametro: '',
                            tipo_dato: '',
                            origen: '',
                            nombre_columna_bd: '',
                            valor_columna_guardar: ''
                        };
                        this.addParametros = [];
                        this.parametrosReporte = false;
                    });
                } catch (error) {
                    console.log(error);
                    this.$toast.error('Error al crear el reporte');
                } finally {
                    this.setPreload(false);
                }
            },

            async registroRutas() {
                this.loading = true;
                try {
                    const response = await this.$axios.post('/reportes/registro-rutas');
                    if (response.status === 200) {
                        this.$toast.success('Se actualizaron las rutas con éxito');
                    }
                } catch (error) {
                    this.$toast.error('Error al actualizar las rutas');
                } finally {
                    this.loading = false;
                }
            },

            obtenerEndPoint() {
                try {
                    this.$axios.get('/reportes/rutas').then(res => {
                        this.rutas = res.data;
                    });
                } catch (error) {
                    console.log(error);
                }
            },

            addParametro() {
                if (!this.formReporte.nombre_parametro) {
                    return
                }
                const ordenExistente = this.addParametros.some(
                    param => param.orden_parametro === this.formReporte.orden_parametro
                );

                if (ordenExistente) {
                    this.$toast.error('El número de posición ya está en uso');
                } else {
                    this.addParametros.push({
                        nombre_parametro: this.formReporte.nombre_parametro,
                        orden_parametro: this.formReporte.orden_parametro,
                        tipo_dato: this.formReporte.tipo_dato,
                        origen: this.formReporte.origen,
                        nombre_columna_bd: this.formReporte.nombre_columna_bd,
                        valor_columna_guardar: this.formReporte.valor_columna_guardar
                    });

                    this.formReporte.nombre_parametro = '';
                    this.formReporte.orden_parametro = '';
                    this.formReporte.tipo_dato = '';
                    this.formReporte.origen = '';
                    this.formReporte.nombre_columna_bd = '';
                    this.formReporte.valor_columna_guardar = '';

                    this.$toast.success('Parámetro agregado correctamente');
                }
            },

            obtenerReportesParametrizados() {
                try {
                    this.$axios.get('/reportes/obtener-reportes').then(res => {
                        this.reportes = res.data
                    });
                } catch (error) {
                    this.$toast.error('Error al actualizar las rutas');
                }
            },

            toggleAccordion(id) {
                if (this.expanded.includes(id)) {
                    this.expanded = [];
                } else {
                    this.expanded = [id];
                }
            },

            cancelarReporte() {
                this.addParametros = []
                for (const key in this.formReporte) {
                    this.formReporte[key] = ''
                }
                this.dialogoFormReporte = false
            },
        },
    };

</script>
<style scoped>
    .clickable-row {
        cursor: pointer;
    }

    .detail-row {
        margin-bottom: 8px;
    }

    .custom-loader {
        display: flex;
        align-items: center;
        justify-content: center;
    }

</style>
