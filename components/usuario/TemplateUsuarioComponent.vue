<template>
    <div class="d-flex align-center">
        <v-avatar color="primary" size="33" class="white--text font-weight-bold">
            {{ getIniciales(nombre) }}
        </v-avatar>
        <div class="ml-2 text-left">
            <p class="my-0 py-0 font-weight-medium">{{ nombre }}</p>
            <p class="my-0 py-0 font-weight-light">{{ descripcion }}</p>
        </div>
    </div>
</template>
<script>

export default {
    name: 'TemplateUsuarioComponent',
    props: {
        nombre: {
            type: String,
            required: true
        },
        descripcion: {
            type: String,
            required: false,
            default: 'Usuario'
        }
    }, 
    methods: {
        getIniciales(nombre){
            return nombre.split(' ').map(part => part.charAt(0).toUpperCase()).join('').slice(0, 2);
        }
    },
    mounted() {
        
    }
};
</script>