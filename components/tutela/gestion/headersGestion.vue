<template>
<v-row dense class="mt-4">
            <v-container>
                <v-row  class="text-center">
                    <v-col v-for="item in titles" :key="index" cols="2"><b>{{ item.text }}</b></v-col>
                </v-row>
            </v-container>
        <v-container>
            <v-row  v-show=" !titles.length" align="center" class="text-center">
                <v-col>No se tiene informacion registrada</v-col>
            </v-row>
        </v-container>

</v-row>

</template>


<script>

export default({
    props:[
        'titles',
    ],
})

</script>