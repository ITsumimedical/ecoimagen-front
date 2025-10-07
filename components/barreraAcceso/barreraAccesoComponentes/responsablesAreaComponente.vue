<template>
    <v-menu open-on-hover right offset-y>
		<template v-slot:activator="{ on }">
			<v-icon small v-on="on" @mouseover="obtenerResponsables()" color="primary">mdi-account-group</v-icon>
		</template>
		<v-list v-if="responsables && responsables.length > 0">
			<v-list-item v-for="responsable in responsables" :key="responsable.id">
				<v-list-item-content>
					<v-chip label color="blue-grey lighten-5">
						<v-icon color="primary" left>mdi-account-tie</v-icon>
						<b>{{ responsable.nombre }}</b>
					</v-chip>
					<v-list-item-subtitle class="ml-2">
						{{ responsable.correo }}
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
			responsables: [],
		}
	},

	methods: {
		obtenerResponsables() {
			if(this.responsables.length > 0){
				return;
			}
			this.$axios
				.post("/responsable-barrera-acceso/responsable-por-area/" + this.item.id)
				.then((res) => {
					this.responsables = res.data;
				})
				.catch((error) => {
					this.$toast.error(error.response.data.mensaje);
				});
		},
	}
}
</script>
