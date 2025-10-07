<template>
    <v-card>
        <v-card-title>{{ editar ? 'Editar' : 'Crear' }} Homologo</v-card-title>
        <v-card-text>
            <form @submit.prevent="submit">
              <v-row>
               <v-col cols="12" sm="12" md="6">
                <v-autocomplete solo v-model="form.cup_id" label="Cup" :items="cup"
                      item-text="nombre" item-value="id">
                    </v-autocomplete>
               </v-col>
               <v-col cols="12" sm="12" md="6">
                <v-autocomplete solo v-model="form.tipo_manual_tarifario_id" label="Tipo manual" :items="tipoManual"
                      item-text="nombre" item-value="id">
                    </v-autocomplete>
               </v-col>
                <v-btn type="submit">{{ editar ? 'Editar' : 'Crear' }}</v-btn>
                <v-btn text @click="$emit('submit'), limpiar()">cerrar</v-btn>
              </v-row>
            </form>
        </v-card-text>
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

    name: 'FormHomologo',

    props: {
        editar: Boolean,
        homologo_id : Number
    },

    watch: {
        homologo_id(){
            this.getHomologo()
        }
    },

    data(){
        return {
            form: {
                cup_id : null,
                tipo_manual_tarifario_id : null
            },
            tipoManual: [],
            cup:[],
        }
    },

    mounted(){
      this.getCup()
      this.getTipoManual()
    },

    methods:{

        async submit(){
            try {
                if (!this.form.cup_id) return false;
                const request = {
                    'cup_id' : this.form.cup_id,
                    'tipo_manual_tarifario_id' : this.form.tipo_manual_tarifario_id,
                }
                if(this.editar){
                    await this.$axios.put('/homologo/' + this.homologo_id, request)
                    this.$toast.success('El homologo se edito correctamente.')
                }else{
                    await this.$axios.post('/homologo', request)
                    this.$toast.success('El homologo se creo correctamente.')
                }
                this.limpiar();
                this.$emit('submit')
            } catch (error) {
                console.log(error)
            }
        },

        async getHomologo(){
            try{
                const response = await this.$axios.get('/homologo/consultar/' + this.homologo_id)
                this.form.cup_id = parseInt(response.data.cup_id)
                this.form.tipo_manual_tarifario_id = parseInt(response.data.tipo_manual_tarifario_id)
            }catch(error){
                console.log(error.response)
            }
        },

        limpiar(){
            this.form.cup_id = null
            this.form.tipo_manual_tarifario_id = null
        },

        async getCup(){
          try {
            const response = await this.$axios.get('/cups')
            this.cup = response.data
          } catch (error) {

          }
        },

        async getTipoManual(){
          try {
            const response = await this.$axios.get('/tipo-manual-tarifario')
            this.tipoManual = response.data
          } catch (error) {

          }
        }

    }

}
</script>
