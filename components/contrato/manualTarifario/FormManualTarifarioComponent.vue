<template>
    <v-card
        :disabled="loading"
        :loading="loading"
    >
        <v-alert text dense outlined type="info">
            {{ editar ? 'Editar' : 'Crear' }} tipo manual
        </v-alert>
        <form @submit.prevent="submit">
            <v-card-text>
                <v-text-field
                    v-model="form.nombre"
                    label="Nombre *"
                    :error-messages="errores.nombre"
                ></v-text-field>
                <v-text-field
                    v-model="form.descripcion"
                    label="Descripción"
                    :error-messages="errores.descripcion"
                ></v-text-field>
            </v-card-text>

            <v-card-actions class="justify-end">
                <v-btn small @click="$emit('cerrar'), limpiar()" color="error">cancelar</v-btn>
                <v-btn small type="submit" color="success">{{ editar ? 'Editar' : 'Crear' }}</v-btn>
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

    name: 'FormTipoManual',

    props: {
        editar:{
            type: Boolean,
            default: false,
        },
        manual_tarifario_id : {
            type: Number,
            default: null,
        }
    },

    watch: {
        manual_tarifario_id(){
            if(this.manual_tarifario_id){
                this.getManualTarifario()
            }
        }
    },

    mounted(){
        if(this.manual_tarifario_id){
            this.getManualTarifario()
        }
    },

    data(){
        return {
            form: {
                nombre : null,
                descripcion : null,
            },
            errores:{
                nombre: null,
                descripcion: null
            },
            loading: false
        }
    },

    methods:{

        async submit(){
            try {
                if (!this.form.nombre) return this.$swal(
                  'No puede ser!',
                  'El campo Nombre es obligatorio',
                  'error'
                );

                this.loading = true;
                const request = {
                    'nombre' : this.form.nombre,
                    'descripcion': this.form.descripcion
                }

                if(this.editar){
                    await this.$axios.put('/manual-tarifario/' + this.manual_tarifario_id, request)
                    this.$toast.success('El manual tarifario se edito correctamente.')
                }else{
                    await this.$axios.post('/manual-tarifario', request)
                    this.$toast.success('El manual tarifario se creo correctamente.')
                }
                this.limpiar();
                this.$emit('submit')
                this.$emit('cerrar')
                this.loading = false;
            } catch (error) {
                this.loading = false;
                if(error.response.status === 422){
                    this.pintarErrores(error.response.data);
                }
            }
        },

        async getManualTarifario(){
            try{
                const { data } = await this.$axios.get('/manual-tarifario/' + this.manual_tarifario_id)
                this.form.nombre = data.nombre
                this.form.descripcion = data.descripcion
            }catch(error){
                console.log(error.response)
            }
        },

        /** Pinta los errores de validación */
        pintarErrores(errores) {
            for (const key in this.errores) {
                if (key in errores) {
                    this.errores[key] = errores[key].join(', ')
                }
            }
        },

        limpiar(){
            this.form.nombre = null
            this.form.descripcion = null
        }

    }

}
</script>
