package com.cjh.websocket.service;


import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.BufferedInputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.OutputStream;
import java.net.URLEncoder;

public class ChatService {
    String chatEntity = "C:\\catalogFile\\kefu\\chat_file" ;

    public void downloadChatFile(String filePath, HttpServletResponse response
            , HttpServletRequest request) throws Exception {
        File f = new File(chatEntity + filePath);
        if (!f.exists()) {
            response.sendError(404, "File not found!");
            return;
        }
        BufferedInputStream br = new BufferedInputStream(new FileInputStream(f));
        byte[] buf = new byte[1024];
        int len = 0;
        String file_name = f.getName().substring(f.getName().indexOf("_") + 1, f.getName().length());
        //处理文件名有中文问题
        if (request.getHeader("User-Agent").toUpperCase().indexOf("MSIE") > 0) {
            file_name = URLEncoder.encode(file_name, "UTF-8");
        } else {
            file_name = new String(file_name.getBytes(), "ISO-8859-1");
        }

        response.reset(); // 非常重要
        response.setContentType("application/x-msdownload");
        response.setHeader("Content-Disposition", "attachment;filename=\"" + file_name + "\"");
//        if (true) { // 在线打开方式
//            URL u = new URL("file:///" + chatFile + filePath);
//            response.setContentType(u.openConnection().getContentType());
//            response.setHeader("Content-Disposition", "inline; filename=\""+file_name+"\"");
//            // 文件名应该编码成UTF-8
//            response.setContentType("text/plain;charset=UTF-8");
//        } else { // 纯下载方式
//
//        }
        OutputStream out = response.getOutputStream();
        while ((len = br.read(buf)) > 0)
            out.write(buf, 0, len);
        br.close();
        out.close();
    }


}
