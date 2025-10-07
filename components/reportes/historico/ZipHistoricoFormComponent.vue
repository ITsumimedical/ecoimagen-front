<template>
    <v-form ref="form" v-model="valid" lazy-validation>
        <v-alert v-if="excel.duplicados.length" class="mb-5" border="left" color="red" dense outlined type="error">
            <div class="mb-5">
                Existen {{ excel.duplicados.length }} coincidencias en el excel, no pueden haber documentos duplicados.
            </div>
            <div class="d-flex justify-space-between">
                <span>Descargar excel con los valores unicos</span>
                <v-btn small outlined color="primary" @click="exportarExcel">Descargar</v-btn>
            </div>

        </v-alert>

        <v-row>
            <v-col cols="12" sm="6" md="6">
                <v-text-field v-model="form.fecha_inicio" label="Fecha Inicial" outlined dense type="date"
                    :rules="rules.fecha_inicio"></v-text-field>
            </v-col>

            <v-col cols="12" sm="6" md="6">
                <v-text-field v-model="form.fecha_final" label="Fecha Final" outlined dense type="date"
                    :rules="rules.fecha_final"></v-text-field>
            </v-col>

            <v-col cols="12" md="4" sm="4">
                <v-autocomplete :loading="loadings.tipo_historias" dense outlined deletable-chips clearable small-chips
                    multiple v-model="form.tipo_historia" :items="tipo_historias" label="Tipo de historia"
                    item-text="nombre" item-value="id" @focus="listarTipoConsulta()"></v-autocomplete>
            </v-col>

            <v-col cols="12" md="4" sm="4">
                <v-autocomplete :loading="loadings.especialidades" dense outlined deletable-chips clearable small-chips
                    multiple v-model="form.especialidades" :items="especialidades" label="Especialidades"
                    item-text="nombre" item-value="id" @focus="listarEspecialidades"></v-autocomplete>
            </v-col>

            <v-col cols="12" md="4" sm="4">
                <v-autocomplete dense v-model="form.medico_id" :items="medicos" item-text="nombre" item-value="id" outlined
                    label="Medico" :search-input.sync="buscarMedico"
                    no-data-text="Escribe al menos 4 letras para buscar"></v-autocomplete>
            </v-col>

            <v-col cols="12">
                <v-text-field v-model="form.fecha_corte" label="Fecha de corde" outlined dense type="date"
                    :rules="rules.fecha_corte"></v-text-field>
            </v-col>

            <v-col cols="12">
                <v-file-input v-model="form.file" label="Excel con los documentos" show-size truncate-length="25"
                    outlined dense :rules="rules.file"></v-file-input>
            </v-col>

            <v-col cols="12" align="right">
                <v-btn small :disabled="!valid" color="primary" @click="submit">
                    generar
                </v-btn>
                <v-btn small color="error" class="mr-4" @click="reset">
                    limpiar
                </v-btn>
            </v-col>

        </v-row>

    </v-form>
</template>
<script>
import { leerExcel, crearExcel } from '@/utils/excel';
export default {

    data() {
        return {
            form: {
                fecha_inicio: '',
                fecha_final: '',
                fecha_corte: '',
                file: null,
                tipo_historia: [],
                especialidades: [],
                medico_id: null,
            },
            rules: {
                fecha_inicio: [
                    v => !!v || 'Debe seleccionar una fecha inicial',
                    v => new Date(v) <= new Date(this.form.fecha_final) || 'La fecha inicial debe ser anterior o igual a la fecha final'
                ],
                fecha_final: [
                    v => !!v || 'Debe seleccionar una fecha final',
                    v => new Date(v) >= new Date(this.form.fecha_inicio) || 'La fecha final debe ser posterior o igual a la fecha inicial'
                ],
                fecha_corte: [
                    v => !!v || 'Debe seleccionar una fecha de corte',
                ],
                file: [
                    v => !!v || 'Debe seleccionar un archivo',
                ]
            },
            loadings: {
                tipo_historias: false,
                especialidades: false,
                medicos: false,
            },
            excel: {
                unicos: [],
                duplicados: [],
            },
            valid: true,
            tipo_historias: [],
            especialidades: [],
            medicos: [],
            buscarMedico: null,
        }
    },

    watch: {
        buscarMedico(val) {
            if (val && val.length == 4) {
                this.listarMedicos();
            }
        },
        'form.fecha_inicio': function (val) {
            this.$nextTick(() => {
                this.$refs.form.validate();
            });
        },
        'form.fecha_final': function (val) {
            this.$nextTick(() => {
                this.$refs.form.validate();
            });
        },
    },

    methods: {

        async submit() {
            try {

                if (!this.validate()) {
                    return;
                }

                // leemos el archivo excel
                const excelValido = await this.validarExcel(this.form.file)
                if (!excelValido) {
                    return;
                }

                const request = new FormData()
                request.append('fecha_inicio', this.form.fecha_inicio)
                request.append('fecha_final', this.form.fecha_final)
                request.append('file', this.form.file)
                request.append('medico_id', this.form.medico_id)
                request.append('fecha_corte', this.form.fecha_corte)

                for (let i = 0; i < this.form.tipo_historia.length; i++) {
                    request.append(`tipo_historia[]`, this.form.tipo_historia[i]);
                }

                for (let i = 0; i < this.form.especialidades.length; i++) {
                    request.append(`especialidades[]`, this.form.especialidades[i]);
                }

                const data = await this.$axios.post('historia/zip-historias', request, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                })
                this.$toast.success('La geneneracion de las historias esta en proceso, se notificara al mail cuando esta finalice.')
                this.reset();
            } catch (error) {
                this.$toast.error('Hubo un error al generar las historias.')
                console.log(error)
            }
        },

        /**
         * validamos que el archivo excel no tenga duplicados
         * @param file
         */
        async validarExcel(file) {

            this.excel.duplicados = []

            const data = await leerExcel(file);
            const coleccionUnica = new Set();
            const duplicados = [];

            for (let i = 0; i < data.length; i++) {
                // para mayor comodidad convertimos el array a string, por que son tambien arrays
                const arrayCodificado = JSON.stringify(data[i]);
                if (coleccionUnica.has(arrayCodificado)) {
                    duplicados.push(data[i]);
                } else {
                    coleccionUnica.add(arrayCodificado);
                }
            }

            if (duplicados.length > 0) {
                this.excel.duplicados = duplicados;
                this.excel.unicos = Array.from(coleccionUnica).map((item) => {
                    return JSON.parse(item);
                });
                return false;
            }

            return true;
        },

        exportarExcel() {
            if (this.excel.unicos.length > 0) {
                crearExcel(this.excel.unicos)
            }
        },

        limpiar() {
            this.reset();
            this.excel.duplicados = []
            this.excel.unicos = []
        },

        validate() {
            return this.$refs.form.validate()
        },
        reset() {
            this.$refs.form.reset()
        },
        resetValidation() {
            this.$refs.form.resetValidation()
        },

        async listarTipoConsulta() {
            if (this.tipo_historias.length > 0) {
                return;
            }
            try {
                this.loadings.tipo_historias = true;
                const response = await this.$axios.get('tipo-historia')
                this.tipo_historias = response.data
            } catch (error) {
                this.$toast.error('Error al listar los tipos de consulta')
            } finally {
                this.loadings.tipo_historias = false;
            }
        },

        async listarEspecialidades() {
            if (this.especialidades.length > 0) return;
            try {
                this.loadings.especialidades = true;
                const response = await this.$axios.get('especialidades');
                this.especialidades = response.data;
            } catch (error) {
                this.$toast.error('Error al listar las especialidades');
            } finally {
                this.loadings.especialidades = false;
            }
        },

        async listarMedicos() {
            const data = {
                nombre: this.buscarMedico,
            }
            try {
                this.loadings.medicos = true;
                const response = await this.$axios.post('operador/listarFiltro', data);
                this.medicos = response.data.map((medico) => {
                    return {
                        id: medico.id,
                        nombre: `${medico.nombre} ${medico.apellido}`
                    }
                });
            } catch (error) {
                this.$toast.error('Error al listar los medicos');
            } finally {
                this.loadings.medicos = false;
            }
        }

    },


}
</script>
