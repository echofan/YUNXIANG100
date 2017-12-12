<template>
  <view-box style="background:#fff;">
    <flexbox class="avatar-item">
      <flexbox-item>
        修改头像
      </flexbox-item>
      <flexbox-item class="avatar-warp">
        <div class="avatar needsclick">
          <div class="needsclick" @click="selectImg">
            <img v-if="params.headImg" :src="params.headImg" class="needsclick" alt="" width="50px">
            <img v-if="!params.headImg" src="../assets/12353.png" class="needsclick" alt="" width="50px">
          </div>
        </div>
      </flexbox-item>
      <file-upload name="file_upload" ref="upload" :accept="accept" :extensions="extensions" @input-file="inputFile" v-model="files" :post-action="postAction"></file-upload>
    </flexbox>
    <flexbox class="nickname-item">
      <div>
        修改昵称
      </div>
      <flexbox-item>
        <input type="text" v-model="params.nickname" class="nickname" placeholder="您的昵称">
      </flexbox-item>
    </flexbox>
    <div class="operate">
      <button class="btn btn-normal" @click.prevent="save">保存</button>
    </div>
    <loading v-model="showLoading" text="上传中..."></loading>
  </view-box>
</template>

<script>
import FileUpload from 'vue-upload-component'
import { Loading, ViewBox, Flexbox, FlexboxItem } from 'vux'
export default {
  name: 'login',
  components: {
    FileUpload,
    Flexbox,
    FlexboxItem,
    ViewBox,
    Loading
  },
  data: function () {
    return {
      user: {},
      showLoading: false,
      files: [],
      accept: 'image/png,image/gif,image/jpeg,image/jpg,image/webp',
      extensions: 'gif,jpg,jpeg,png,webp',
      postAction: '/higo/open/api/member/uploadHeadImg?memberId=' + this.$cookie.get('memberId') + '&token=' + this.$cookie.get('token'),
      params: {
        memberId: this.$cookie.get('memberId'),
        token: this.$cookie.get('token'),
        headImg: '',
        nickname: ''
      },
      auto: true
    }
  },
  methods: {
    selectImg: function () {
      let e = document.getElementById('file_upload')
      e.click()
    },
    save: function () {
      this.$http.post('member/updateImgAndNickName', null, {
        params: {
          memberId: this.$cookie.get('memberId'),
          token: this.$cookie.get('token'),
          ...this.params
        }
      })
        .then(response => {
          return response.data
        }).then(response => {
          if (response.code === 0) {
            this.$router.go(-1)
          } else {
            this.$vux.toast.show({ type: 'warn', text: response.msg })
          }
        })
    },
    inputFile: function (newFile, oldFile) {
      if (newFile && !oldFile) {
        console.log('add', newFile)
        var URL = window.URL || window.webkitURL
        if (URL && URL.createObjectURL) {
          this.$refs.upload.update(newFile, { blob: URL.createObjectURL(newFile.file) })
        }
      }
      if (newFile && oldFile) {
        console.log('update', newFile, oldFile)
        if (newFile.progress !== oldFile.progress) {
          console.log('progress', newFile.progress)
          if (newFile.progress === '100.00') {
            this.showLoading = false
            this.params.headImg = newFile.response.data.url
          }
        }
      }
      if (!newFile && oldFile) {
        console.log('remove', oldFile)
      }
      if (this.auto && !this.$refs.upload.uploaded && !this.$refs.upload.active) {
        this.$refs.upload.active = true
        this.showLoading = true
      }
    },
    getMyInfo: function () {
      this.$http.post('member/getMyInfo', null, {
        params: {
          memberId: this.$cookie.get('memberId'),
          token: this.$cookie.get('token')
        }
      })
        .then(response => {
          return response.data
        }).then(response => {
          if (response.code === 0) {
            this.params.headImg = response.data.headImg
            this.params.nickname = response.data.nickname
          } else {
            this.$vux.toast.show({ type: 'warn', text: response.msg })
          }
        })
    }
  },
  created: function () {
    this.getMyInfo()
  }
}
</script>

<style scoped>
.avatar-item {
  padding: 10px 20px;
}

.avatar-warp {
  text-align: center;
}

.avatar {
  display: inline-block;
  width: 50px;
  height: 50px;
  border: 3px solid #eee;
  border-radius: 5px;
  overflow: hidden;
}

.avatar img {
  width: 100%;
  height: 100%;
}

.nickname-item {
  padding: 25px 20px;
  border-top: 1px solid #eee;
  border-bottom: 1px solid #eee;
}

.nickname {
  font-size: 16px;
  width: 160px;
  padding: 0 10px;
  border: none;
  outline: none;
}

.operate {
  padding: 30px 0;
}

.btn {
  display: block;
  text-align: center;
  background: none;
  margin: 0 auto;
  border: none;
  border-radius: 10px;
  color: #FFF;
}

.btn.btn-normal {
  font-size: 16px;
  background: #a72184;
  width: 60%;
  padding: 6px 20px;
}
</style>

