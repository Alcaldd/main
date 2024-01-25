<script>
export default {
    name: "AlertaExito",
    props: ["mensaje"]
}
</script>

<template>
    
    <div class="alert alert-success" role="alert">
        <strong>EXITO:</strong> {{ mensaje  }}
    </div>
    

</template>