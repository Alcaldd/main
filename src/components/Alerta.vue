<script>
export default {
    name: "Alerta",
    props: ["mensaje"]
}
</script>

<template>
    
    <div class="alert alert-danger" role="alert">
        <strong>ERROR:</strong> {{ mensaje  }}
    </div>
    

</template>