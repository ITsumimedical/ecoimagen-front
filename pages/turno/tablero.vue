<template>
    <v-container fluid>
        <TurnoTableroComponent />
    </v-container>
</template>
<script>
import TurnoTableroComponent from "@/components/turno/TurnoTableroComponent.vue"
export default {
middleware({
      $can,
      redirect
    }) {
      if (!$can('blog.vista')) {
        return redirect('/');
      }
    },
    layout: 'turnero',
    auth: true,
    components:{
        TurnoTableroComponent
    }
}
</script>
