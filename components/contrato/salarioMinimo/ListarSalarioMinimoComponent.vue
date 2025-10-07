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

        <v-card class="mx-100">
            <div>
                <v-toolbar flat>
                    <v-spacer></v-spacer>
                    <v-btn v-if="$can('contrato.salarioMinimo.guardar')" color="success" class="white--text ma-2 px-6"
                           small
                           @click="dialogs.form = true">Crear
                        <v-icon>mdi-plus</v-icon>
                    </v-btn>
                </v-toolbar>
            </div>

            <v-data-table :headers="headers" :items="salario" loading-text="cargando..." class="elevation-1"
                          hide-default-footer no-data-text="Sin datos para mostrar">
                <template v-for="dato of datosAnules" v-slot:[`item.${dato}`]="{ item }">
                    <v-edit-dialog :return-value.sync="item[dato]" large lazyg persistent save-text="Guardar"
                        @save="actualizarValor(item)">
                        {{ new Intl.NumberFormat('es-CO').format(item[dato]) }}
                        <v-icon v-if="$can('contrato.salarioMinimo.actualizar') && !item[dato]" color="warning">mdi-pencil</v-icon>
                        <template v-slot:input>
                            <div class="text-h6">Editar valor</div>
                            <v-text-field v-model="item[dato]" type="number" single-line autofocus></v-text-field>
                        </template>
                    </v-edit-dialog>

                </template>
            </v-data-table>
        </v-card>
        <v-dialog persistent v-model="dialogs.form" max-width="500px">
            <FormSalarioMinimo @cerrar="cerraModalCrear()" @submit="getSalarioMinimo()"/>
        </v-dialog>
    </div>
</template>

<script>
import FormSalarioMinimo from "~/components/contrato/salarioMinimo/FormSalarioMinimoComponent.vue";

export default {
    middleware({
                   $can,
                   redirect
               }) {
        if (!$can("contrato.salarioMinimo.listar")) {
            return redirect("/");
        }
    },
    components: {
        FormSalarioMinimo,
    },
    name: "ListarSalarioMinimoComponent",

    data() {
        return {
            datosAnules: [
                'valor',
                'cuota_moderadora_a',
                'cuota_moderadora_b',
                'cuota_moderadora_c',
                'copago_a',
                'copago_b',
                'copago_c',
                'copago_tope_evento_a',
                'copago_tope_evento_b',
                'copago_tope_evento_c',
                'copago_tope_anual_a',
                'copago_tope_anual_b',
                'copago_tope_anual_c',
                'copago_subsidiado',
                'copago_subsidiado_tope_evento',
                'copago_subsidiado_tope_anual'
            ],
            editando: false,
            preload: false,
            parametros: [],
            manual_tarifario_id: null,
            rango: [
                'MENOR A 2 SMLMV',
                'ENTRE 2 Y 5 SMLMV',
                'MAYOR A 5 SMLMV'
            ],
            headersParametros: [{
                text: "ID",
                value: "id",
            },
                {
                    text: "Rango",
                    value: "rango",
                    align: "start"
                },
                {
                    text: "Cuota Moderadora Mes",
                    value: "valorCuota",
                    align: "start"
                },
                {
                    text: "Copago Mes",
                    value: "valorEvento",
                    align: "start"
                },
                {
                    text: "Tope Evento Mes",
                    value: "valorEvento",
                    align: "start"
                },
                {
                    text: "Cuota Moderadora Anual",
                    value: "valorCuotaAnual",
                    align: "start"
                },
                {
                    text: "Copago Anual",
                    value: "valorCopagosAnual",
                    align: "start"
                },
                {
                    text: "Tope Evento Anual",
                    value: "valorEventoAnual",
                    align: "start"
                },
            ],
            errores: {
                rango: null,
                valorCuota: null,
                valorCopagos: null,
                valorEvento: null,
                valorCuotaAnual: null,
                valorCopagosAnual: null,
                valorEventoAnual: null
            },
            form2: {
                rango: null,
                valorCuota: null,
                valorCopagos: null,
                valorEvento: null,
                valorCuotaAnual: null,
                valorCopagosAnual: null,
                valorEventoAnual: null
            },
            headers: [{
                text: "ID",
                value: "id",
                align: "start"
            },
                {
                    text: "Año",
                    value: "anio",
                    align: "start"
                },

            ],
            salario: [],
            buscar: null,
            loading: false,
            salario_id: null,
            dialogs: {
                form: false,
                copagos: false,
            },
        };
    },

    mounted() {
        this.getSalarioMinimo();
        for (const dato of this.datosAnules) {
            this.headers.push({
                text: dato.replace(/_/g, ' ').toUpperCase(),
                value: dato,
                align: 'center'
            })
        }
    },

    methods: {
        async getSalarioMinimo() {
            this.preload = true
            try {
                const {
                    data
                } = await this.$axios.get("/salario-minimo");
                this.salario = data;
                this.preload = false;
            } catch (error) {
                this.preload = false;
                this.$toast.error("Error al cargar los datos");
            }
        },

        submitParametros() {
            this.preload = true
            this.$axios
                .put("/salario-minimo/parametros/" + this.salario_id, this.form2)
                .then((res) => {
                    this.preload = false;
                    this.limpiar();
                    this.getParametros();
                    this.$toast.success(res.data.mensaje);
                })
                .catch((error) => {
                    this.preload = false
                    this.$toast.error("Error al cargar los datos");
                });
        },

        getParametros() {
            this.preload = true
            this.$axios.get("/salario-minimo/listarParametros/" + this.salario_id).then((res) => {
                this.preload = false;
                this.parametros = res.data;
            }).catch((error) => {
                this.preload = false
                this.$toast.error("Error al cargar los datos");
            });
        },

        cerraModalCrear() {
            this.dialogs.form = false;
            this.getSalarioMinimo();
        },

        dialogoParametrizaciones(item) {
            this.dialogs.copagos = true;
            this.salario_id = item.id;
            this.getParametros();
        },

        limpiar() {
            this.form2.rango = null,
                this.form2.valorCuota = null,
                this.form2.valorCopagos = null,
                this.form2.valorEvento = null,
                this.form2.valorCuotaAnual = null,
                this.form2.valorCopagosAnual = null,
                this.form2.valorEventoAnual = null
        },

        actualizarValor(item) {
            this.preload = true
            this.$axios
                .put("/salario-minimo/" + item.id, item)
                .then((res) => {
                    this.preload = false
                    this.$toast.success(res.data.mensaje);
                })
                .catch((error) => {
                    this.preload = false
                    this.$toast.error("Error al cargar los datos");
                });
        },
    },
};

</script>
