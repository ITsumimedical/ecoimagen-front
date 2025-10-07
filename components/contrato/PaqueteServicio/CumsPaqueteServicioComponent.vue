<template>
    <v-card class="mb-6" :loading="loading" :disabled="loading">
        <v-card-title class="claro oscuro--text mb-5">Cums</v-card-title>
        <v-card-text>

            <v-autocomplete
                solo
                v-model="cum"
                label="Busca un cum para agregar al paquete"
                :items="all_cums"
                item-text="descripcion_comercial"
                item-value="id"
                append-icon="mdi-plus"
                @click:append="agregar()"
                return-object
            ></v-autocomplete>

            <v-data-table
                :headers="headers"
                :items="cums"
                :items-per-page="5"
                class="elevation-0"
            >
                <template v-slot:[`item.acciones`]="{ item }">
                    <v-icon
                        small
                        @click="eliminar(item)"
                    >
                        mdi-delete
                    </v-icon>
                </template>
            </v-data-table>

            <v-btn color="primary" @click="submit()">Guardar cambios</v-btn>
            <v-btn color="error">cancelar</v-btn>

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

    props: {
        paquete_servicio_id: {
            type: Number,
            default: null
        }
    },

    watch: {
        paquete_servicio_id (val) {
            this.getCums();
        }
    },

    data(){
        return {
            all_cums: [],
            cums: [],
            cum: null,
            headers: [
                { text: 'Codigo', value: 'cum_validacion' },
                { text: 'Nombre', value: 'producto' },
                { text: 'Titular', value: 'titular' },
                { text: 'Fecha expedición', value: 'fecha_expedicion' },
                { text: 'Fecha vencimiento', value: 'fecha_vencimiento' },
                { text: 'Estado', value: 'estado_registro' },
                { text: 'Acciones', value: 'acciones', sortable: false },
            ],
            loading: false
        }
    },

    mounted(){
        this.getAllCums();
        this.getCums();
    },

    methods: {
        /** Obtiene los cums */
        async getAllCums(){
            try{
                this.loading = true;
                const { data } = await this.$axios.get('cum');
                this.all_cums = data;
                this.loading = false;
            }catch(error){
                this.$toast.error('Error al listar los medicamentos');
            }
        },

        async getCums(){
            try{
                this.loading = true;
                const { data } = await this.$axios.get('paquete/cums/' + this.paquete_servicio_id)
                this.cums = data.cums
                this.loading = false;
            }catch(error){
                this.loading = false;
                this.$toast.error('Error al listar los cups actuales.');
            }
        },

        async submit(){
            try{

            }catch(error){

            }
        },

        agregar(){
            /** Validamos que haya algo seleccionado */
            if(!this.cum){
                return false;
            }
            /** Buscamos que el item no exista, antes de agregarlo */
            const indice = this.cums.findIndex(item => item.id === this.cum.id);
            if(indice >= 0){
                return false;
            }

            this.cums.push(this.cum)
            this.cum = null
        },

        eliminar(cum){

            if(!confirm('Deses quitar el cum ' + cum.nombre + ' de este paquete?')){
                return false;
            }

            const indice = this.cums.findIndex(item => item.id === cum.id);
            const array = this.cums;
            array.splice(indice, 1);
            this.cums = array;
        },
    }
}
</script>
