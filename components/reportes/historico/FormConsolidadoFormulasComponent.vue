<template>
    <v-form ref="form" v-model="valid" lazy-validation>
        <v-row>
            <v-col cols="12">
                <v-text-field v-model="form.fecha" label="Fecha" type="date" outlined dense
                    :rules="rules.fecha"></v-text-field>
            </v-col>
            <v-col cols="12">
                <v-file-input v-model="form.file" label="Fórmulas" outlined dense
                    :rules="rules.file" accept=".xlsx, .xls, .csv"></v-file-input>
            </v-col>
        </v-row>
        <v-row>
            <v-col class="text-right">
                <v-btn color="secondary" outlined @click="limpiar()">limpiar</v-btn>
                <v-btn color="primary" @click="generar()">generar</v-btn>
            </v-col>
        </v-row>
    </v-form>
</template>
<script>

export default {

    data() {
        return {
            valid: false,
            form: {
                fecha: null,
                file: null
            },
            rules: {
                fecha: [
                    v => !!v || 'La fecha es requerida',
                ],
                file: [
                    v => !!v || 'El archivo es requerido',
                ]
            }
        }
    },

    methods: {

        async generar() {
            // Validación del formulario
            if (!this.$refs.form.validate()) {
                return
            }
            try {
                this.$emit('loading', true);

                const formData = new FormData();
                formData.append('fecha', this.form.fecha);
                formData.append('file', this.form.file);
                
                const response = await this.$axios.post('/ordenamiento/generar/consolidado-formulas', formData);
                this.$toast.success(response.data.mensaje || 'Consolidado generado correctamente');
                this.limpiar();
            } catch (error) {
                this.$toast.error('Error al generar el consolidado');
                console.log(error.response);
            } finally {
                this.$emit('loading', false);
            }
        },

        limpiar() {
            this.form.fecha = null;
            this.$refs.form.resetValidation();
        },
    }

}

</script>