<template>
  <div class="app-container">
    <h2 style="text-align: center">发布新课程</h2>

    <!--步骤条-->
    <el-steps :active="2" process-status="wait" align-center style="margin-bottom: 40px;">
      <el-step title="填写课程基本信息"></el-step>
      <el-step title="创建课程大纲"></el-step>
      <el-step title="最终发布"></el-step>
    </el-steps>

    <el-button type="text" @click="openDialog()">添加章节</el-button>

    <ul class="chanpterList">
      <!--遍历章节-->
      <li v-for="chapter in chapterVideoList" :key="chapter.id">
        <p>
          {{ chapter.title }}
          <span class="acts">
            <!--<el-button type="text">添加课时</el-button>-->
            <el-button type="text"  @click="openVideo(chapter.id)">添加小节</el-button>
            <el-button type="text" @click="openEditChapter(chapter.id)">编辑</el-button>
            <el-button type="text" @click="removeChapter(chapter.id)">删除</el-button>
          </span>
        </p>
        <ul class="chanpterList videoList">
          <!--遍历小节-->
          <li v-for="video in chapter.children" :key="video.id">
            <p>{{ video.title }}
              <span class="acts">
                <el-button type="text">编辑</el-button>
                <el-button type="text" @click="removeVideo(video.id)">删除</el-button>
              </span>
            </p>
          </li>
        </ul>
      </li>
    </ul>

    <el-form label-width="120px">
      <el-form-item>
        <el-button @click="previous">上一步</el-button>
        <el-button :disabled="saveBtnDisabled" type="primary" @click="next">下一步</el-button>
      </el-form-item>
    </el-form>

    <!-- 添加和修改章节表单 -->
    <el-dialog :visible.sync="dialogVisible" title="添加章节">
      <el-form :model="chapter" label-width="120px">
        <el-form-item label="章节标题">
          <el-input v-model="chapter.title"/>
        </el-form-item>
        <el-form-item label="章节排序">
          <el-input-number v-model="chapter.sort" :min="0" controls-position="right"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveOrUpdate">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 添加和修改课时表单 -->
    <el-dialog :visible.sync="dialogVideoVisible" title="添加课时">
      <el-form :model="video" label-width="120px">
        <el-form-item label="课时标题">
          <el-input v-model="video.title"/>
        </el-form-item>
        <el-form-item label="课时排序">
          <el-input-number v-model="video.sort" :min="0" controls-position="right"/>
        </el-form-item>
        <el-form-item label="是否免费">
          <el-radio-group v-model="video.isFree">
            <el-radio :label="1">免费</el-radio>
            <el-radio :label="0">默认</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="上传视频">
          <el-upload
            :on-success="handleVodUploadSuccess"
            :on-remove="handleVodRemove"
            :before-remove="beforeVodRemove"
            :on-exceed="handleUploadExceed"
            :file-list="fileList"
            :action="BASE_API+'/eduvod/video/uploadAliyun'"
            :limit="1"
            class="upload-demo">
            <el-button size="small" type="primary">上传视频</el-button>
            <el-tooltip placement="right-end">
              <div slot="content">最大支持1G，<br>
                支持3GP、ASF、AVI、DAT、DV、FLV、F4V、<br>
                GIF、M2T、M4V、MJ2、MJPEG、MKV、MOV、MP4、<br>
                MPE、MPG、MPEG、MTS、OGG、QT、RM、RMVB、<br>
                SWF、TS、VOB、WMV、WEBM 等视频格式上传
              </div>
              <i class="el-icon-question"/>
            </el-tooltip>
          </el-upload>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVideoVisible = false;helpSaveVideo()">取 消</el-button>
        <el-button type="primary" @click="saveOrUpdateVideo">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import chapter from '@/api/teacher/chapter'
import video from '@/api/teacher/video'

export default {
  name: 'Chapter',
  data() {
    return {
      chapter: {// 章节对象
        title: '',
        courseId: '',
        sort: 0
      },
      video: {// 小节对象
        title: '',
        sort: 0,
        isFree: 0,
        chapterId: '',
        courseId: '',
        videoSourceId: '',
        videoOriginalName: ''
      },
      saveVideoBtnDisabled: false,
      dialogVideoVisible: false,
      dialogVisible: false,//是否显示对话框
      courseId: '',//课程id
      saveBtnDisabled: false, // 保存按钮是否禁用
      chapterVideoList: [],
      fileList: [],//上传文件列表
      BASE_API: process.env.BASE_API //接口API地址
    }
  },
  created() {
    // 获取路由里面的id值
    if (this.$route.params && this.$route.params.id) {
      this.courseId = this.$route.params.id
      // 根据课程id查询章节和小节
      this.getChapterVideo()
    }
  },
  methods: {
    // 删除视频之前回调
    beforeVodRemove(file, fileList) {
      return this.$confirm(`确定删除视频【${file.name}】吗？`)
    },
    // 删除视频回调
    handleVodRemove() {
      // 调用接口删除视频的方法
      video.deleteAliyunVideo(this.video.videoSourceId)
        .then(result => {
          this.$message({
            type: 'success',
            message: '视频删除成功！'
          })
          // 清空文件列表
          this.fileList = []
          // 清空视频相关信息
          this.video.videoSourceId = ''
          this.video.videoOriginalName = ''
        })
    },
    // 上传视频成功调用的方法
    handleVodUploadSuccess(resp, file) {
      this.video.videoSourceId = resp.data.data
      this.video.videoOriginalName = file.name
      this.$message.success('视频删除成功！')
    },
    handleUploadExceed() {
      this.$message.warning('想要重新上传视频，请先删除已上传的视频')
    },

    //===============================小节操作====================================

    // 删除小节
    removeVideo(id) {
      this.$confirm('此操作将永久删除小节, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 调用删除方法
        video.deleteVideo(id)
          .then(result => {
            this.$message({
              type: 'success',
              message: '删除小节成功!'
            })
            this.getChapterVideo()
          })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    helpSaveVideo() {

    },

    // 添加小节,添加小节成功
    addVideo() {
      // 设置课程id
      this.video.courseId = this.courseId
      video.addVideo(this.video)
        .then(result => {
          // 关闭弹框
          this.dialogVideoVisible = false
          console.log('======', this.video)
          // 提示
          this.$message({
            type: 'success',
            message: '添加小节成功！'

          })
          this.video = {
            title: '',
            sort: 0,
            isFree: 0,
            chapterId: '',
            courseId: '',
            videoSourceId: '',
            videoOriginalName: ''
          }
          this.fileList = []
          // 刷新页面
          this.getChapterVideo()
        })
    },
    // 添加或修改小节信息
    saveOrUpdateVideo() {
      this.addVideo()
    },
    // 添加小节弹框的方法
    openVideo(chapterId) {
      // 弹框
      this.dialogVideoVisible = true
      // 设置章节id
      this.video.chapterId = chapterId
      this.saveVideoBtnDisabled = false
    },
    //===============================章节操作====================================
    // 删除章节
    removeChapter(chapterId) {
      this.$confirm('此操作将永久删除章节, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        chapter.deleteChapter(chapterId)
          .then(result => {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            // 刷新页面
            this.getChapterVideo()
          })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // 修改章节弹框数据回显
    openEditChapter(chapterId) {
      this.dialogVisible = true
      chapter.getChapterById(chapterId)
        .then(result => {
          this.chapter = result.data.data
        })
    },
    // 打开对话框
    openDialog() {
      this.chapter.sort = 0
      this.chapter.title = ''
      this.dialogVisible = true
    },
    addChapter() {
      this.chapter.courseId = this.courseId
      chapter.addChapter(this.chapter)
        .then(result => {
          // 关闭弹框
          this.dialogVisible = false
          // 提示
          this.$message({
            type: 'success',
            message: '添加章节成功！'
          })
          // 刷新页面
          this.getChapterVideo()
        })
    },
    //修改章节方法
    updateChapter() {
      chapter.updateChapter(this.chapter)
        .then(result => {
          // 关闭弹框
          this.dialogVisible = false
          // 提示
          this.$message({
            type: 'success',
            message: '修改章节成功！'
          })
          // 刷新页面
          this.getChapterVideo()
        })
    },

    // 添加或删除章节
    saveOrUpdate() {
      if (!this.chapter.courseId) {
        this.addChapter()
      } else {
        this.updateChapter()
      }

    },
    // 根据课程id查询章节和小节
    getChapterVideo() {
      chapter.getAllChapterVideo(this.courseId)
        .then(result => {
          this.chapterVideoList = result.data.data
        })
    },
    // 上一步
    previous() {
      this.$router.push({ path: '/course/info/' + this.courseId })
    },
    // 根据课程ID判断是保存还是修改
    next() {
      // 跳转到第二步
      this.$router.push({ path: '/course/publish/' + this.courseId })
    }
  }
}
</script>

<style scoped>
.chanpterList {
  position: relative;
  list-style: none;
  margin: 0;
  padding: 0;
}

.chanpterList li {
  position: relative;
}

.chanpterList p {
  /*float: left;*/
  font-size: 20px;
  margin: 10px 0;
  padding: 10px;
  height: 70px;
  line-height: 50px;
  width: 100%;
  border: 1px solid #DDD;
}

.chanpterList .acts {
  float: right;
  font-size: 14px;
}

.videoList {
  padding-left: 50px;
}

.videoList p {
  /*float: left;*/
  font-size: 14px;
  margin: 10px 0;
  padding: 10px;
  height: 50px;
  line-height: 30px;
  width: 100%;
  border: 1px dotted #DDD;
}
</style>
