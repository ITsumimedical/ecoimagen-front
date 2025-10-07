<template>
    <v-card elevation="0">
        <v-card-title>
            <v-toolbar flat>
                <v-toolbar-title>
                    <div class="d-flex align-center">
                        <img src="/images/ojo.svg" alt="" height="50px" width="50px" />
                        <span>Crear tipo de reporte</span>
                    </div>
                </v-toolbar-title>
                <v-divider class="mx-4" inset vertical></v-divider>
            </v-toolbar>
        </v-card-title>
        <v-card>
            <v-card-text flat>
                <v-row>
                    <v-col cols="12" sm="6" md="3">
                        <v-text-field label="Nombre del Reporte" v-model="form.nombre" outlined dense required />
                    </v-col>
                    <v-col cols="12" sm="6" md="3">
                        <v-text-field label="URL" v-model="form.url" outlined dense required />
                    </v-col>
                    <v-col cols="12" sm="6" md="3">
                        <v-text-field label="Función SQL" v-model="form.funcion_sql" outlined dense required />
                    </v-col>
                    <v-col cols="12" sm="6" md="3">
                        <v-text-field label="Permiso" v-model="form.permiso" outlined dense required />
                    </v-col>
                </v-row>
                <v-col cols="12">
                    <v-alert dense text outlined color="info" class="text-center">
                        Campos del Reporte
                    </v-alert>
                </v-col>
                <v-row v-for="(campo, index) in form.campos" :key="index">
                    <v-col cols="12" sm="6" md="4">
                        <v-select label="Tipo de Campo" v-model="campo.tipoCampo" :items="tiposCampo" outlined dense required />
                    </v-col>
                    <v-col cols="12" sm="6" md="4" v-if="campo.tipoCampo !== 'date'">
                        <v-text-field label="Nombre del Campo" v-model="campo.nombre" outlined dense required />
                    </v-col>
                    <v-col cols="12" sm="6" md="4" v-else>
                        <v-select label="Nombre del Campo" v-model="campo.nombre" :items="['fecha_inicial', 'fecha_final']" outlined dense required />
                    </v-col>
                    <v-col cols="12" sm="6" md="4" v-if="campo.tipoCampo === 'select'">
                        <v-text-field label="Origen" v-model="campo.origen" outlined dense />
                    </v-col>
                    <v-col cols="12" sm="6" md="4" v-if="campo.tipoCampo === 'text'">
                        <v-text-field label="Valor Default" v-model="campo.valorDefault" outlined dense />
                    </v-col>
                    <v-col cols="12" sm="6" md="4" v-if="campo.tipoCampo === 'checkbox'">
                        <v-select label="Valor Default" v-model="campo.valorDefault" :items="[1, 0]" outlined dense required />
                    </v-col>
                    <v-col cols="12" sm="6" md="4" v-if="campo.tipoCampo !== 'checkbox'">
                        <v-switch label="Requerido" v-model="campo.requerido" dense />
                    </v-col>
                    <v-col cols="12" sm="12" md="12" class="text-right">
                        <v-btn icon color="error" @click="eliminarCampo(index)">
                            <v-icon>mdi-delete</v-icon>
                        </v-btn>
                    </v-col>
                    <v-row dense>
                        <v-col cols="12" sm="12" md="12" class="my-4">
                            <v-divider></v-divider>
                        </v-col>
                    </v-row>
                </v-row>
                <v-card-actions>
                    <v-row dense>
                        <v-col cols="12" sm="12" md="12" class="my-4">
                            <v-divider></v-divider>
                        </v-col>
                        <v-col cols="12" sm="12" md="12">
                            <v-btn :loading="loading" color="info" @click="agregarCampo">
                                Agregar parámetros
                            </v-btn>
                        </v-col>
                    </v-row>
                </v-card-actions>
                <v-card-actions>
                    <v-row dense>
                        <v-col cols="12" sm="12" md="12" class="my-4">
                            <v-divider></v-divider>
                        </v-col>
                        <v-col cols="12" sm="12" md="12" class="text-right">
                            <v-btn :loading="loading" color="success" @click="guardarReporte">
                                Guardar Reporte
                            </v-btn>
                        </v-col>
                    </v-row>
                </v-card-actions>
                <v-divider></v-divider>
            </v-card-text>
        </v-card>
    </v-card>
</template>

<script>
export default {
    data: () => ({
        form: {
            nombre: '',
            url: '',
            funcion_sql: '',
            permiso: '',
            campos: []
        },
        tiposCampo: ['select', 'text', 'checkbox', 'date'],
        loading: false
    }),
    methods: {
        agregarCampo() {
            this.form.campos.push({ nombre: '', origen: '', tipoCampo: '', requerido: false, valorDefault: '' });
        },
        eliminarCampo(index) {
            this.form.campos.splice(index, 1);
        },
        guardarReporte() {
            this.form.campos.forEach(campo => {
                if (campo.tipoCampo !== 'select') {
                    delete campo.origen;
                }
            });

            this.loading = true;
            this.$axios
                .post('/reportes/configuracion-reportes', this.form)
                .then((response) => {
                    this.$toast.success('Reporte guardado exitosamente');
                    this.form = {
                        nombre: '',
                        url: '',
                        funcion_sql: '',
                        permiso: '',
                        campos: []
                    };
                })
                .catch((error) => {
                    console.error('Error al guardar el reporte:', error.response ? error.response.data : error.message);
                    this.$toast.error('Error al guardar el reporte');
                })
                .finally(() => {
                    this.loading = false;
                });
        },
    }
};
</script>
