<template>
  <v-row dense style="width: 100%">
    <v-col cols="12" sm="4" md="4">
      <v-text-field v-model="params.fechaInicial" outlined dense type="date" label="Fecha Inicial"></v-text-field>
    </v-col>
    <v-col cols="12" sm="4" md="4">
      <v-text-field v-model="params.fechaFinal" outlined dense type="date" label="Fecha Final"></v-text-field>


    </v-col>
    <v-col cols="12" sm="4" md="4">
      <v-autocomplete v-model="params.especialidadId" outlined dense label="Especialidad" item-text="nombre" item-value="id" :items="especialidades" :loading="loading.especialidades"></v-autocomplete>

    </v-col>
  </v-row>


</template>
<script>


export default {
  data() {
    return {
      params: {
        fechaInicial: null,
        fechaFinal: null,
        especialidadId: null,
      },
      loading:{
        especialidades: false
      },
      especialidades:[],
    }
  },
  watch: {
        params: {
            handler(newVal) {
                this.$emit("update-params", newVal);
            },
            deep: true,
        },
    },
  mounted(){
    this.listarEspecialidades();
  },


  methods:{
    async listarEspecialidades(){
      try {
        this.loading.especialidades = true;
        const response = await this.$axios.get("/especialidades");
        this.especialidades = response.data;
      } catch (error) {
        this.$toast.error("Error al cargar las Especialidades");
        console.log(error)
      } finally{
        this.loading.especialidades = false;
      }
    }
  }
}
</script>



