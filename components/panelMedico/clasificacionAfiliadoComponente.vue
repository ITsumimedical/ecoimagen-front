<template>
	<v-menu open-on-hover right offset-y>
		<template v-slot:activator="{ on }">
			<v-icon v-on="on" @mouseover="getClasificacionAfiliado()" color="primary">mdi-account-tag</v-icon>
		</template>
		<v-list v-if="clasificaciones && clasificaciones.length > 0">
			<v-list-item v-for="clasifiacion in clasificaciones" :key="clasifiacion.id">
				<v-list-item-content>
					<v-chip label :text-color="!clasifiacion.clasificacion.color || clasifiacion.clasificacion.color === '#ffffff' ? 'black' : 'white'" :color="clasifiacion.clasificacion.color">
						<v-icon :color="!clasifiacion.clasificacion.color || clasifiacion.clasificacion.color === '#ffffff' ? 'black' : 'white'">mdi-label</v-icon>
						<b>{{ clasifiacion.clasificacion.nombre }}</b>
					</v-chip>
					<v-list-item-subtitle class="ml-2">
						{{ clasifiacion.clasificacion.descripcion }}
					</v-list-item-subtitle>
				</v-list-item-content>
			</v-list-item>
		</v-list>

	</v-menu>
</template>
<script>
export default {
	props: {
		item: Object,
	},
	data() {
		return {
			clasificaciones: [],
		}
	},
	methods: {
		getClasificacionAfiliado() {
			if(this.clasificaciones.length > 0){
				return;
			}
			this.$axios
				.post("/afiliacion-clasificacion/listar/" + this.item.afiliado.id)
				.then((res) => {
					this.clasificaciones = res.data;
					console.log(this.clasificaciones);
				})
				.catch((error) => {
					this.$toast.error(error.response.data.mensaje);
				});
		},
	}
}
</script>
