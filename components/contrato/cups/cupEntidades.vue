<template>
  <div>
    <v-card :loading="cargandoDatos">
      <v-alert text dense color="success" icon="mdi-home-group-plus" border="left">
        <b>Agregar entidades</b>
      </v-alert>
      <v-card-text>
        <v-col>
          <v-autocomplete label="Entidades" v-model="entidad" outlined dense :items="entidades" item-text="nombre"
            item-value="id" chips multiple deletable-chips>
          </v-autocomplete>
        </v-col>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red" dark small @click="cerrarDialogo">
            Cerrar
          </v-btn>
          <v-btn color="success" small @click="agregarEntidades" :loading="loading">
            Agregar entidades
          </v-btn>
        </v-card-actions>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
  export default {
    props: ['cup_id'],
    data() {
      return {
        entidad: [],
        entidades: [],
        loading: false,
        cargandoDatos: false,
      };
    },
    mounted() {
      this.listarEntidades();
      this.listarEntidadesAsignadas();
    },
    methods: {
      listarEntidades() {
        this.$axios
          .get('entidad/listar')
          .then((res) => {
            this.entidades = res.data;
          })
          .catch((error) => {
            console.log(error);
          });
      },

      listarEntidadesAsignadas() {
        this.cargandoDatos = true
        this.$axios
          .get(`cup/obtenerEntidades/${this.cup_id}`)
          .then((res) => {
            this.entidad = res.data;
          })
          .catch((error) => {
            console.log('Error al listar las entidades asignadas', error);
          }).finally(() => {
            this.cargandoDatos = false
          })
      },
      agregarEntidades() {
        if (this.entidad.length === 0) {
          this.$toast.error('Debes elegir por lo menos una entidad');
          return;
        }
        this.loading = true;
        this.$axios
          .post(`cup/asignarEntidades/${this.cup_id}`, {
            entidades: this.entidad
          })
          .then(() => {
            this.$toast.success('Se han agregado las entidades con éxito');
            this.$emit('cerrarDialogo');
            this.entidad = [];
          })
          .catch((error) => {
            this.$toast.error('Error al agregar las entidades');
            console.error(error);
          })
          .finally(() => {
            this.loading = false;
          });
      },

      cerrarDialogo() {
        this.$emit('cerrarDialogo');
      }
    }
  };

</script>
