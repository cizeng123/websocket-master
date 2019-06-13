package com.cjh.websocket.controller;

import com.cjh.websocket.service.ChatService;
import com.cjh.websocket.utility.FileSizeUtil;
import com.cjh.websocket.utility.ToJsonUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.File;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@Controller
@RequestMapping("/up")
public class uploadFilesController {


    @PostMapping("/uploadFiles")
    public void uploadFiles(MultipartFile file, HttpServletResponse response) throws IllegalStateException, IOException {
        String chatFile="C:\\catalogFile\\kefu\\chat_file";
        String originalFilename = file.getOriginalFilename();
        String new_filename = System.currentTimeMillis()+ "_" + originalFilename;
        File new_file = new File(chatFile + File.separator + new_filename);
        file.transferTo(new_file);
        Map<String, String> map = new HashMap<>();
        map.put("fileName", originalFilename);
        map.put("path", "//" + new_filename);
        map.put("size", FileSizeUtil.getFileSizeAuto(new_file.length()));
        ToJsonUtil.toJSONStringWithDateFormat(response, map);
    }


    @RequestMapping(value = "/downloadChatFile", produces = "text/html;charset=UTF-8")
    @ResponseBody
    public void downloadChatFile(String filePath, HttpServletResponse response,HttpServletRequest request) {
        try {
            ChatService chatService = new ChatService();
            chatService.downloadChatFile(filePath, response, request);
            ToJsonUtil.toJSONStringWithDateFormat(response,"success");
        } catch (Exception e) {
            ToJsonUtil.toJSONStringWithDateFormat(response,"error");
        }

    }
}
