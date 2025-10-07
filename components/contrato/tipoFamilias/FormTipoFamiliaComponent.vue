<template>
    <v-card>
        <v-card-title class="claro oscuro--text mb-4">
            {{ editar ? 'Editar' : 'Crear' }} Tipo familia
        </v-card-title>
        <form @submit.prevent="submit">
            <v-card-text>
              <p>Campos obligatorios *</p>
                <v-text-field v-model="form.nombre" label="Nombre *" :error-messages="errors.nombre"></v-text-field>
                <v-text-field v-model="form.descripcion" label="Descripcion *" :error-messages="errors.descripcion"></v-text-field>
            </v-card-text>
            <v-card-actions class="justify-end">
                <v-btn color="error" @click="$emit('cerrar'), limpiar()">cerrar</v-btn>
                <v-btn color="primary" type="submit">{{ editar ? 'Editar' : 'Crear' }}</v-btn>
            </v-card-actions>
        </form>
    </v-card>
</template>
<script>
export default {
middleware({
      $can,
      redirect
    }) {
      if (!$can('blog.vista')) {
        return redirect('/');
      }
    },

    name: 'FormTipoFamilia',

    props: {
        editar: Boolean,
        tipo_familia_id : Number
    },

    watch: {
        tipo_familia_id(){
            if(this.editar){
                this.getTipoFamilia()
            }
        }
    },

    data(){
        return {
            form: {
                nombre : null,
                descripcion : null
            },
            errors: {
                nombre : null,
                descripcion : null
            },
        }
    },

    mounted(){
        if(this.editar){
            this.getTipoFamilia()
        }
    },

    methods:{
        async submit(){
            try {
                // if (!this.form.nombre) return false;
                const request = {
                    'nombre' : this.form.nombre,
                    'descripcion' : this.form.descripcion
                }
                if(this.editar){
                    await this.$axios.put('/tipo-familia/' + this.tipo_familia_id, request)
                    this.$toast.success('El tipo de familia se edito correctamente.')
                }else{
                    await this.$axios.post('/tipo-familia', request)
                    this.$toast.success('El tipo de familia se creo correctamente.')
                }
                this.limpiar();
                this.$emit('cerrar')
                this.$emit('submit')
            } catch (error) {
                this.ErrorEntrada(error.response.data)
            }
        },

        async getTipoFamilia(){
            try{
                const { data } = await this.$axios.get('/tipo-familia/consultar/' + this.tipo_familia_id)
                this.form.nombre = data.nombre
                this.form.descripcion = data.descripcion
            }catch(error){
                this.$toast.error('Error al consultar el tipo de familia.')
            }
        },

        limpiar(){
            this.form.nombre = null
            this.form.descripcion = null
            this.limpiarError()
        },

        ErrorEntrada(errors) {
            for (const key in this.errors) {
                if (key in errors) {
                    this.errors[key] = errors[key].join(',')
                }
            }
        },

        limpiarError() {
            this.errors.nombre = null
            this.errors.descripcion = null
        },
    }

}
</script>
