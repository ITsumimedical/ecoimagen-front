<template>
    <div>
        <v-card elevation="0">
            <v-card-title>
                <v-toolbar flat>
                    <v-toolbar-title>
                        <div class="d-flex align-center">
                            <img src="/images/ojo.svg" alt="" height="50px" width="50px" />
                            <span>Cuentas de Alto Costo - Generar Archivo</span>
                        </div>
                    </v-toolbar-title>
                    <v-divider class="mx-4" inset vertical></v-divider>
                </v-toolbar>
            </v-card-title>
            <v-card-text>
                <v-form ref="formGenerarArchivo">
                    <v-row dense>
                        <v-col cols="12" sm="12" md="6">
                            <v-autocomplete dense outlined label="Patología" :items="patologias.opciones"
                                :loading="patologias.loading" item-text="nombre" item-value="id"
                                v-model="formGenerar.patologia_id" :rules="[rules.obligatorio]" />
                        </v-col>
                        <v-col cols="12" sm="12" md="6">
                            <v-select dense outlined label="Mes" :items="meses.opciones" v-model="formGenerar.periodo"
                                :rules="[rules.obligatorio]" />
                        </v-col>
                        <v-col cols="12" sm="12" md="6">
                            <v-select dense outlined label="Año" :items="anios.opciones" v-model="formGenerar.anio"
                                :rules="[rules.obligatorio]" />
                        </v-col>
                        <v-col cols="12" sm="12" md="6">
                            <v-text-field dense outlined label="Correo Electrónico" v-model="formGenerar.correo"
                                type="email" :rules="[rules.obligatorio, rules.email]" />
                        </v-col>
                        <v-col cols="12" sm="12" md="12" align="right">
                            <v-btn color="primary" @click="enviarFormulario">
                                Generar
                            </v-btn>
                        </v-col>
                    </v-row>
                </v-form>
            </v-card-text>
        </v-card>
    </div>
</template>
<script>
export default {
    data() {
        return {
            rules: {
                obligatorio: v => !!v || 'Este campo es obligatorio.',
                email: v => !v || /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(v) || 'Correo electrónico no válido.'
            },
            formGenerar: {
                patologia_id: null,
                periodo: null,
                anio: new Date().getFullYear(),
                correo: null
            },
            meses: {
                opciones: [
                    { text: 'Enero', value: 1 },
                    { text: 'Febrero', value: 2 },
                    { text: 'Marzo', value: 3 },
                    { text: 'Abril', value: 4 },
                    { text: 'Mayo', value: 5 },
                    { text: 'Junio', value: 6 },
                    { text: 'Julio', value: 7 },
                    { text: 'Agosto', value: 8 },
                    { text: 'Septiembre', value: 9 },
                    { text: 'Octubre', value: 10 },
                    { text: 'Noviembre', value: 11 },
                    { text: 'Diciembre', value: 12 },
                ],
            },
            patologias: {
                opciones: [],
                loading: false
            },
            anios: {
                opciones: Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - i)
            }
        };
    },
    mounted() {
        this.listarPatologias();
    },
    methods: {
        obtenerFechasMes(anio, mes) {
            const inicio = new Date(anio, mes - 1, 1);
            const fin = new Date(anio, mes, 0);
            return {
                fecha_inicio: inicio.toISOString().split('T')[0],
                fecha_fin: fin.toISOString().split('T')[0],
            };
        },

        async listarPatologias() {
            try {
                this.patologias.loading = true;

                const { data } = await this.$axios.get('/cac/listar-patologias', {
                    params: {
                        activo: true
                    }
                });

                this.patologias.opciones = data;
            } catch (error) {
                this.$toast.error('Error al listar las patologías');
            } finally {
                this.patologias.loading = false;
            }
        },

        async enviarFormulario() {

            if (!this.$refs.formGenerarArchivo.validate()) return;

            const { anio, periodo, patologia_id, correo } = this.formGenerar;

            const { fecha_inicio, fecha_fin } = this.obtenerFechasMes(anio, periodo);

            const payload = {
                patologia_id,
                anio,
                mes: periodo,
                fecha_inicio,
                fecha_fin,
                correo
            };

            try {
                await this.$axios.post('/cac/generar-archivo-cac', payload);
                await this.$swal({
                    type: 'info',
                    title: 'Información',
                    text: 'El archivo se encuentra en proceso de generación, será enviado a su correo electrónico.',
                    showConfirmButton: true,
                    confirmButtonText: 'Cerrar'
                });

                this.limpiarFormulario();
            } catch (error) {
                this.$toast.error('Error al generar el archivo');
            }
        },

        limpiarFormulario() {
            

            this.$refs.formGenerarArchivo.reset();
        }
    }
};
</script>