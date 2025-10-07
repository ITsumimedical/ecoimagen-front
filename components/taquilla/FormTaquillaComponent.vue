<template>
  <div>
    <v-card>
      <!-- titulo -->
      <v-card-title class="titulo white--text">{{ datos.editar ? 'Editar' : 'Crear' }} Taquilla</v-card-title>
      <!-- formulario -->
      <v-spacer></v-spacer>
      <v-card-text>
        <v-text-field outlined v-model="form.nombre" label="Nombre de la taquilla" :error-messages="errors.nombre">
        </v-text-field>
        <v-autocomplete outlined :items="areas" item-text="nombre" item-value="id" v-model="form.area_clinica_id"
          label="Area" :error-messages="errors.area_clinica_id">
        </v-autocomplete>
        <v-btn dark color="boton" @click="guardarEditar()">{{ datos.editar ? 'Editar' : 'Crear' }}</v-btn>
        <v-btn dark color="error" @click="$emit('respuestaComponente'), limpiar()">cerrar</v-btn>
      </v-card-text>
    </v-card>
  </div>
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
    props: {
      datos: Object
    },

    data() {
      return {
        taquilla_id: null,
        areas: [],
        errors: {
          nombre: '',
          area_clinica_id: ''
        },
        form: {
          nombre: null,
          area_clinica_id: null
        }
      }
    },


    created() {
      this.getAreas();
      this.modelEditar();
    },

    methods: {

      /**
       * funcion de guardar o actualizar nombre taquilla
       * @author juan david
       */
      async guardarEditar() {
        try {
          if (!this.form.nombre) return false;

          if (this.datos.editar == true) {
            await this.$axios.put('/taquilla/' + this.datos.taquilla_id, this.form)
            this.$toast.success('La taquilla se edito correctamente.')
          } else {
            await this.$axios.post('/taquilla', this.form)
            this.$toast.success('La taquilla se creo correctamente.')
          }
          this.limpiar();
          this.$emit('respuestaComponente')
        } catch (error) {
          if (error.response.data.mensaje) {
            this.$toast.error(error.response.data.mensaje)
          } else if (error.response.data) {
            this.ErrorEntrada(error.response.data)
          }
        }
      },

      /**
       * funcion para recorrer errores
       * @author kobatime
       */
      ErrorEntrada(errors) {
        for (const key in this.errors) {
          if (key in errors) {
            this.errors[key] = errors[key].join(',')
          }
        }
      },

      /**
       * funcion para limpiar errores
       * @author kobatime
       */
      limpiarError() {
        for (const key in this.errors) {
          this.errors[key] = ''
        }
      },

      /**
       * listar aeras
       * @author kobatime
       */
      async getAreas() {
        try {
          const response = await this.$axios.get('/area-clinica')
          this.areas = response.data
        } catch (error) {
          console.log(error)
        }
      },

      /**
       * transformar datos
       * @author kobatime
       */
      modelEditar() {
        this.form = this.datos
      },

      /**
       * limipiar modal
       * @author juan david
       */
      limpiar() {
        this.limpiarError()
        this.form.nombre = null
        this.taquilla_id = null
        this.form.area_clinica_id = null
      }

    }

  }

</script>
