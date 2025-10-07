<template>
  <v-card>
    <v-alert text outlined dense type="info">
      {{ editar ? 'Editar' : 'Crear' }} Tipo prestador
    </v-alert>
    <form @submit.prevent="submit">
      <v-card-text>
        <v-text-field dense v-model="form.nombre" label="Nombre *" :error-messages="errors.nombre"></v-text-field>
        <p>Campos obligatorios *</p>
      </v-card-text>
      <v-card-actions class="justify-end">
        <v-btn small color="error" @click="$emit('cerrar'), limpiar()">cerrar</v-btn>
        <v-btn small type="submit" color="success" class="mr-2">{{ editar ? 'Editar' : 'Crear' }}</v-btn>
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

    name: 'FormTipoPrestador',

    props: {
      editar: {
        type: Boolean,
        default: false
      },
      tipo_prestador_id: {
        type: Number,
        default: null
      }
    },

    watch: {
      tipo_prestador_id() {
        if (this.editar) {
          this.getTipoPrestador()
        }
      }
    },

    data() {
      return {
        form: {
          nombre: null,
        },
        errors: {
          nombre: null,
        }
      }
    },

    mounted() {
      if (this.editar) {
        this.getTipoPrestador()
      }
    },

    methods: {

      async submit() {
        this.limpiarError()
        try {
          if (this.editar) {
            await this.$axios.put('/tipo-prestador/' + this.tipo_prestador_id, this.form)
            this.$toast.success('El tipo se edito correctamente.')
          } else {
            await this.$axios.post('/tipo-prestador', this.form)
            this.$toast.success('El tipo se creo correctamente.')
          }
          this.limpiar();
          this.$emit('cerrar')
          this.$emit('submit')
        } catch (error) {
          this.ErrorEntrada(error.response.data)
          this.$toast.error('No se pudo crear/actualizar el tipo de prestador')
        }
      },

      async getTipoPrestador() {
        try {
          const {
            data
          } = await this.$axios.get('/tipo-prestador/' + this.tipo_prestador_id)
          this.form.nombre = data.nombre
        } catch (error) {
          console.log(error.response)
        }
      },

      limpiar() {
        this.form.nombre = null
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
        for (const key in this.errors) {
          this.errors[key] = ''
        }
      },

    }

  }

</script>
