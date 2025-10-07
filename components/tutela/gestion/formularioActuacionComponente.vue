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

    <v-form>
      <v-alert dense text border="left" icon="mdi-text-box-search-outline" type="success">Información de actuación
        consecutivo
        <b>({{item.actuaciones[0].id}}) - {{item.afiliado.nombre_completo}}</b></v-alert>
      <v-row>
        <v-col cols="12" sm="6" md="3">
          <v-text-field dense v-model="tutelas.fecha_radica" label="Fecha radicado" type="date"
            :error-messages="errors.fecha_radica">
          </v-text-field>
        </v-col>
        <v-col cols="12" sm="6" md="3">
          <v-text-field v-model="tutelas.radicado" label="Radicado tutela" dense :error-messages="errors.radicado">
          </v-text-field>
        </v-col>
        <v-col cols="12" sm="6" md="3">
          <v-text-field v-model="tutelas.direccion" label="Dirección" :error-messages="errors.direccion" dense>
          </v-text-field>
        </v-col>
        <v-col cols="12" sm="6" md="3">
          <v-autocomplete v-model="tutelas.municipio_id" :items="municipios" item-text="nombre" item-value="id"
            label="Municipio" :error-messages="errors.municipio_id" dense>
          </v-autocomplete>
        </v-col>
        <v-col cols="12" sm="6" md="3">
          <v-text-field dense v-model="tutelas.telefono" label="Teléfono" type="number"
            :error-messages="errors.telefono">
          </v-text-field>
        </v-col>
        <v-col cols="12" sm="6" md="3">
          <v-text-field dense v-model="tutelas.celular" label="Celular" type="number" :error-messages="errors.celular">
          </v-text-field>
        </v-col>
        <v-col cols="12" sm="6" md="6">
          <v-text-field dense v-model="tutelas.correo" label="Correo" type="email" :error-messages="errors.correo">
          </v-text-field>
        </v-col>
        <v-col cols="12" sm="12" md="12">
          <v-autocomplete dense v-model="tutelas.juzgado_id" :items="juzgados" item-text="nombre" item-value="id"
            label="Juzgado" :error-messages="errors.juzgado_id">
          </v-autocomplete>
        </v-col>
        <v-col cols="12" sm="6" md="3">
          <v-autocomplete dense v-model="tutelas.continuidad" :items="continuidades" label="Continuidad"
            :error-messages="errors.continuidad">
          </v-autocomplete>
        </v-col>
        <v-col cols="12" sm="6" md="3">
          <v-autocomplete dense v-model="tutelas.exclusion" :items="exclusiones" label="Exclusión"
            :error-messages="errors.exclusion">
          </v-autocomplete>
        </v-col>
        <v-col cols="12" sm="6" md="3">
          <v-autocomplete dense v-model="tutelas.integralidad" :items="exclusiones" label="Integralidad"
            :error-messages="errors.integralidad">
          </v-autocomplete>
        </v-col>
        <v-col cols="12" sm="6" md="3">
          <v-autocomplete dense v-model="tutelas.tipo_actuacion_id" :items="tipoActuacion" item-text="nombre"
            item-value="id" label="Tipo actuación" :error-messages="errors.tipo_actuacion_id">
          </v-autocomplete>
        </v-col>
        <v-col cols="12" sm="6" md="2">
          <v-text-field dense v-model="tutelas.dias" label="Dias de Respuesta" type="number"
            :error-messages="errors.dias">
          </v-text-field>
        </v-col>
        <v-col cols="12" sm="6" md="10">
          <v-autocomplete dense chips small-chips deletable-chips v-model="asignar.proceso_tutelas_id" multiple
            :items="procesoListar" item-text="nombre" item-value="id" label="Proceso">
          </v-autocomplete>
        </v-col>
      </v-row>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn small @click="asignarActuacion()" color="success">Asignar</v-btn>
      </v-card-actions>
    </v-form>
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
    name: 'actuacionTutelaComponente',
    props: {
      item: {
        type: Object,
        default: {}
      }
    },
    data() {
      return {
        preload: false,
        municipios: [],
        continuidades: ['NUEVO', 'CONTINUIDAD'],
        exclusiones: ['SI', 'NO'],
        juzgados: [],
        tipoActuacion: [],
        procesoListar: [],
        tutelas: {
          fecha_radica: this.item.actuaciones[0].fecha_radica,
          radicado: this.item.radicado,
          direccion: this.item.actuaciones[0].direccion,
          municipio_id: this.item.municipio_id,
          telefono: this.item.actuaciones[0].telefono,
          celular: this.item.actuaciones[0].celular,
          correo: this.item.actuaciones[0].correo,
          juzgado_id: this.item.juzgado,
          continuidad: this.item.actuaciones[0].continuidad,
          exclusion: this.item.actuaciones[0].exclusion,
          integralidad: this.item.actuaciones[0].integralidad,
          tipo_actuacion_id: this.item.actuaciones[0].tipo_actuacion_id,
          dias: this.item.actuaciones[0].dias,
        },
        errors: {
          fecha_radica: null,
          radicado: null,
          direccion: null,
          municipio_id: null,
          telefono: null,
          celular: null,
          juzgado_id: null,
          continuidad: null,
          exclusion: null,
          integralidad: null,
          tipo_actuacion_id: null,
          dias: null,
          proceso_id: null,
        },
        asignar: {
          actuacion_tutelas_id: '',
          proceso_tutelas_id: [],
        },
      };
    },

    mounted() {
      this.listarMunicipio()
      this.listarjuzgados()
      this.listarTipoActuacion()
      this.listarProcesos()
    },

    methods: {
      listarMunicipio() {
        this.$axios.get('/municipios/listar').then(res => {
          this.municipios = res.data
        }).catch(error => {
          console.log(error)
        })
      },

      listarjuzgados() {
        this.$axios.get('/juzgado/').then(res => {
          this.juzgados = res.data
        }).catch(error => {
          console.log(error)
        })
      },

      listarTipoActuacion() {
        this.loading = true
        this.$axios.get('tipo-actuacion').then(res => {
          this.tipoActuacion = res.data
          this.loading = false
        }).catch(error => {
          this.loading = false
        })
      },

      listarProcesos() {
        this.loading = true
        this.$axios.get('/proceso-tutela/listar').then(res => {
          this.procesoListar = res.data.data
          this.loading = false
        }).catch(error => {
          this.ErrorEntrada(error.response.data)
          this.loading = false
        })
      },

      asignarActuacion() {
        this.asignar.actuacion_tutelas_id = this.item.actuaciones[0].id
        this.loading = true
        this.$axios.post('/actuacion-tutela/asignar', this.asignar).then(res => {
          this.loading = false
        }).catch(error => {
          this.ErrorEntrada(error.response.data)
          this.loading = false
        })
      }
    },
  }

</script>
