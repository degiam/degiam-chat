<script setup lang="ts">
import { reactive, ref, watch } from 'vue';
import { Form } from '@primevue/forms';
import { FormField } from '@primevue/forms';
import Toast from 'primevue/toast';
import { useToast } from 'primevue/usetoast';
import InputText from 'primevue/inputtext';
import Select from 'primevue/select';
import Button from 'primevue/button';
import Message from 'primevue/message';
import WhatsAppLogo from '../assets/brand-whatsapp.svg';
import TelegramLogo from '../assets/brand-telegram.svg';

type Platform = {
  name: string,
  code: string,
  logo: string,
  field: {
    phone: boolean,
    username: boolean,
  },
}

type FormValue = {
  platform: string,
  phone: {
    show: boolean,
    value: string,
  },
  username: {
    show: boolean,
    value: string,
  },
}

const selectedPlatform = ref<Platform | null>(null);
const dataPlatform = ref([
  { name: 'WhatsApp', code: 'whatsapp', logo: WhatsAppLogo, field: { phone: true, username: false } },
  { name: 'Telegram', code: 'telegram', logo: TelegramLogo, field: { phone: false, username: true } },
]);

const cleanPhoneNumber = (value: string): string => {
  return value.replace(/(?!^\+)[^\d]/g, '');
};
const cleanUsername = (value: string): string => {
  return value.replace(/\s+/g, '');
};

const preventInvalidPhoneInput = (event: KeyboardEvent) => {
  const input = event.target as HTMLInputElement;
  const key = event.key;
  const currentValue = input.value;
  const cursorPosition = input.selectionStart || 0;
  const allowedChars = /^\d$/;

  if (key === '+') {
    if (cursorPosition !== 0 || currentValue.includes('+')) {
      event.preventDefault();
    }
    return;
  }

  if (!allowedChars.test(key)) {
    event.preventDefault();
  }
};
const preventInvalidUsernameInput = (event: KeyboardEvent) => {
  const allowedChars = /^[^\s]$/;
  const key = event.key;

  if (!allowedChars.test(key)) {
    event.preventDefault();
  }
};

const toast = useToast();

const initialValues: FormValue = reactive({
  platform: '',
  phone: {
    show: false,
    value: '',
  },
  username: {
    show: false,
    value: '',
  },
});

const resolver = ({ values }) => {
  const errors: Record<string, any> = {};

  if (!values.platform) {
    errors.platform = [{ message: 'Silakan pilih salah satu' }];
  }

  if (selectedPlatform.value?.field?.phone) {
    const cleanedPhone = cleanPhoneNumber(values.phone);
    if (!cleanedPhone) {
      errors.phone = [{ message: 'Nomor ponsel harus diisi' }];
    } else {
      values.phone = cleanedPhone;
    }
  }

  if (selectedPlatform.value?.field?.username) {
    const cleanedUsername = cleanUsername(values.username);
    if (!cleanedUsername) {
      errors.username = [{ message: 'Username harus diisi' }];
    } else {
      values.username = cleanedUsername;
    }
  }

  return {
    errors
  };
};

const onFormSubmit = ({ valid }) => {
  if (valid) {
    toast.add({
      severity: 'success',
      summary: 'Form berhasil dikirim',
      detail: 'Terima kasih atas partisipasinya',
      life: 5000
    });
  }
};

watch(selectedPlatform, (newValue) => {
  if (newValue) {
    initialValues.phone.show = newValue.field.phone;
    initialValues.username.show = newValue.field.username;
  }
});
</script>

<template>
  <div class="flex justify-center items-center min-h-screen p-6 main-layout">
    <div class="w-full max-w-lg">

      <Toast />

      <Form v-slot="$form" :initialValues="initialValues" :resolver="resolver" @submit="onFormSubmit" class="flex flex-col gap-4 w-full">
        <FormField v-slot="$field" name="platform" initialValue="" class="flex flex-col gap-1">
          <Select v-model="selectedPlatform" :options="dataPlatform" checkmark :highlightOnSelect="false" optionLabel="name" placeholder="Silakan pilih..." fluid>
            <template #value="slotProps">
              <div v-if="slotProps.value" class="flex items-center">
                <img :alt="slotProps.value.name" :src="slotProps.value.logo" class="w-5 mr-2" />
                <div>{{ slotProps.value.name }}</div>
              </div>
              <span v-else>
                {{ slotProps.placeholder }}
              </span>
            </template>
            <template #option="slotProps">
              <div class="flex items-center">
                <img :alt="slotProps.option.name" :src="slotProps.option.logo" class="w-5 mr-2" />
                <div>{{ slotProps.option.name }}</div>
              </div>
            </template>
          </Select>
          <Message v-if="$field?.invalid" severity="error" size="small" variant="simple">{{ $field.error?.message }}</Message>
        </FormField>

        <FormField v-if="initialValues.phone.show" v-slot="$field" name="phone" initialValue="" class="flex flex-col gap-1">
          <InputText
            v-model="initialValues.phone.value"
            @keypress="preventInvalidPhoneInput"
            @input="initialValues.phone.value = cleanPhoneNumber(initialValues.phone.value)"
            type="tel"
            inputmode="numeric"
            placeholder="Nomor ponsel"
            fluid
          />
          <Message v-if="$field?.invalid" severity="error" size="small" variant="simple">{{ $field.error?.message }}</Message>
        </FormField>

        <FormField v-if="initialValues.username.show" v-slot="$field" name="username" initialValue="" class="flex flex-col gap-1">
          <InputText
            v-model="initialValues.username.value"
            @keypress="preventInvalidUsernameInput"
            @input="initialValues.username.value = cleanUsername(initialValues.username.value)"
            type="text"
            placeholder="Username"
            fluid
          />
          <Message v-if="$field?.invalid" severity="error" size="small" variant="simple">{{ $field.error?.message }}</Message>
        </FormField>

        <Button type="submit" severity="primary" label="Chat Sekarang" />
      </Form>

    </div>
  </div>
</template>

<style scoped>
/* Add any required scoped styles here */
</style>
